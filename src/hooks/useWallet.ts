import { useCallback, useEffect, useState } from 'react';
import { BrowserProvider, formatEther, getAddress } from 'ethers';
import { CHAIN_HEX, CHAIN_ID, CONTRACTS } from '../contracts/config';
import { ERC20_ABI } from '../contracts/abis';
import { Contract } from 'ethers';

declare global { interface Window { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown>; on?: (event: string, cb: (...args: unknown[]) => void) => void; removeListener?: (event: string, cb: (...args: unknown[]) => void) => void } } }
export type WalletData = { address: string; chainId: number; bnb: string; krvn: string; loading: boolean; error: string | null };
export function useWallet() {
  const [data, setData] = useState<WalletData | null>(null);
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async (address?: string) => {
    if (!window.ethereum) return;
    const provider = new BrowserProvider(window.ethereum as never);
    const signer = await provider.getSigner();
    const account = getAddress(address || await signer.getAddress());
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== CHAIN_ID) { setData({ address: account, chainId: Number(network.chainId), bnb: '—', krvn: '—', loading: false, error: 'wrong-network' }); return; }
    setData({ address: account, chainId: CHAIN_ID, bnb: '…', krvn: '…', loading: true, error: null });
    try {
      const [bnb, krvn] = await Promise.all([provider.getBalance(account), new Contract(CONTRACTS.token, ERC20_ABI, provider).balanceOf(account)]);
      setData({ address: account, chainId: CHAIN_ID, bnb: Number(formatEther(bnb)).toFixed(4), krvn: Number(formatEther(krvn)).toLocaleString('en-US', { maximumFractionDigits: 2 }), loading: false, error: null });
    } catch (e) { setData({ address: account, chainId: CHAIN_ID, bnb: '—', krvn: '—', loading: false, error: e instanceof Error ? e.message : 'Unable to read balances' }); }
  }, []);
  const connect = useCallback(async () => {
    if (!window.ethereum) throw new Error('No injected wallet detected. Install a compatible EVM wallet.');
    setBusy(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (!accounts?.[0]) throw new Error('Wallet connection was not approved.');
      const chain = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      if (chain.toLowerCase() !== CHAIN_HEX) {
        try { await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_HEX }] }); }
        catch (err) {
          const code = (err as { code?: number }).code;
          if (code === 4902) await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: CHAIN_HEX, chainName: 'BNB Smart Chain', nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, rpcUrls: ['https://bsc-dataseed.binance.org'], blockExplorerUrls: ['https://bscscan.com'] }] });
          else throw err;
        }
      }
      await refresh(accounts[0]);
    } finally { setBusy(false); }
  }, [refresh]);
  const disconnect = useCallback(() => setData(null), []);
  useEffect(() => {
    if (!window.ethereum) return;
    const onAccounts = (...args: unknown[]) => { const accounts = args[0] as string[]; if (!accounts?.length) setData(null); else void refresh(accounts[0]); };
    const onChain = () => { if (data?.address) void refresh(data.address); };
    window.ethereum.on?.('accountsChanged', onAccounts); window.ethereum.on?.('chainChanged', onChain);
    return () => { window.ethereum?.removeListener?.('accountsChanged', onAccounts); window.ethereum?.removeListener?.('chainChanged', onChain); };
  }, [data?.address, refresh]);
  return { wallet: data, busy, connect, disconnect, refresh };
}
