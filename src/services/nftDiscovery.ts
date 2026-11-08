import { Contract, getAddress, id, zeroPadValue } from 'ethers';
import { DEPLOYMENT_BLOCK, CONTRACTS } from '../contracts/config';
import { ERC721_READ_ABI } from '../contracts/abis';
import { readProvider } from './rpc';

export type NftDiscovery = { tokenIds: bigint[]; source: 'indexer' | 'rpc'; warning?: string };
const TRANSFER_TOPIC = id('Transfer(address,address,uint256)');
const PAGE_SIZE = 1800;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function rpcWithRetry<T>(fn: () => Promise<T>, attempts = 5): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (error) { last = error; if (i === attempts - 1) break; await sleep(Math.min(1000 * 2 ** i, 12000)); }
  }
  throw last instanceof Error ? last : new Error('RPC request failed');
}

async function indexerOwnedIds(wallet: string): Promise<bigint[] | null> {
  const endpoint = import.meta.env.VITE_NFT_INDEXER_URL;
  if (!endpoint) return null;
  const url = new URL(endpoint);
  url.searchParams.set('chainId', '56'); url.searchParams.set('contractAddress', CONTRACTS.nft); url.searchParams.set('owner', wallet);
  const response = await fetch(url.toString(), { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`NFT indexer returned HTTP ${response.status}`);
  const body: unknown = await response.json();
  if (!Array.isArray(body)) throw new Error('NFT indexer response must be an array of token IDs');
  return body.map((v) => BigInt(String(v)));
}

export async function discoverOwnedNfts(wallet: string): Promise<NftDiscovery> {
  const account = getAddress(wallet);
  const indexed = await indexerOwnedIds(account);
  let candidates: bigint[];
  let source: 'indexer' | 'rpc';
  if (indexed) { candidates = indexed; source = 'indexer'; }
  else {
    if (!DEPLOYMENT_BLOCK || !/^\d+$/.test(DEPLOYMENT_BLOCK)) {
      throw new Error('NFT discovery is not configured. Set VITE_ASCEND_DEPLOYMENT_BLOCK to the confirmed deployment block or configure VITE_NFT_INDEXER_URL.');
    }
    const latest = await readProvider.getBlockNumber();
    const fromBlock = Number(DEPLOYMENT_BLOCK);
    const topicsTo = zeroPadValue(account, 32);
    const topicsFrom = zeroPadValue(account, 32);
    const seen = new Set<string>();
    for (let start = fromBlock; start <= latest; start += PAGE_SIZE) {
      const end = Math.min(start + PAGE_SIZE - 1, latest);
      const [incoming, outgoing] = await Promise.all([
        rpcWithRetry(() => readProvider.getLogs({ address: CONTRACTS.nft, fromBlock: start, toBlock: end, topics: [TRANSFER_TOPIC, null, topicsTo] })),
        rpcWithRetry(() => readProvider.getLogs({ address: CONTRACTS.nft, fromBlock: start, toBlock: end, topics: [TRANSFER_TOPIC, topicsFrom] })),
      ]);
      for (const log of incoming) seen.add(BigInt(log.topics[3]).toString());
      for (const log of outgoing) { if (log.topics[1] !== log.topics[2]) seen.delete(BigInt(log.topics[3]).toString()); }
      if (end < latest) await sleep(180);
    }
    candidates = [...seen].map(BigInt); source = 'rpc';
  }
  const nft = new Contract(CONTRACTS.nft, ERC721_READ_ABI, readProvider);
  const owned: bigint[] = [];
  for (const tokenId of candidates) {
    try { const owner = await rpcWithRetry(() => nft.ownerOf(tokenId)); if (getAddress(owner) === account) owned.push(tokenId); }
    catch { /* Burned or invalid token IDs are excluded. */ }
  }
  return { tokenIds: owned.sort((a,b) => a < b ? -1 : a > b ? 1 : 0), source };
}
