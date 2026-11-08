# KRYVON Direct Claim Skill

## Purpose

This skill describes safe assistance for the AGENTKEY KRYVON Direct Claim flow on BNB Smart Chain (chain ID 56). It is a documentation and integration contract for a future AI agent. It does not itself connect to a wallet, read chain data, or submit transactions.

## Ecosystem facts

- Project: AGENTKEY.
- Token: KRYVON (KRVN), 18 decimals.
- Token contract: `0x9D0F4E3387a585D6DF774b76d496D85C03E15237`.
- AgentKey Ascend NFT contract: `0x7946d1F5D498116748C4168Ec23161FEfebDce37`.
- Direct Claim contract: `0xc5EBE5e02f787837236A1D419CCEf30dF72d38C2`.
- Network: BNB Smart Chain Mainnet, chain ID 56.
- The stated reward rule is 3,000 KRVN for each complete group of three eligible, unused NFTs.
- The stated token supply is fixed at 250,000,000 KRVN. The stated Direct Claim funding is 150,000,000 KRVN. These project-supplied facts are not a substitute for live contract verification.

## Eligibility and calculation

The requested project rule is:

`reward = floor(unusedEligibleNFTCount / 3) * 3000 KRVN`

A partial group remains unused for a later claim. A wallet can claim repeatedly if it owns enough eligible, unused NFTs. Every NFT may be consumed only once. NFTs must be owned by the connected wallet at claim time. Direct wallet-to-wallet transfers are not eligible under the stated rules; the NFT is described as soulbound and non-transferable.

Do not treat all owned NFTs as eligible. Eligibility must be established from the deployed Direct Claim contract's verified logic and state. Verify current ownership with `ownerOf(tokenId)` at the time relevant to the claim. Verify prior usage using the actual documented on-chain method or state. Never infer a used/unused state from an event name or UI state.

## NFT discovery

The NFT contract does not implement ERC721Enumerable. Discover candidates using one of:

1. A production NFT indexer with pagination and reorg-aware results; or
2. Transfer event scanning from the confirmed deployment block, using RPC pagination, retries, and rate-limit handling.

The deployment block is not known in this repository. It must be supplied as `VITE_ASCEND_DEPLOYMENT_BLOCK` from authoritative deployment records. Never guess it. After candidate discovery, verify each candidate with `ownerOf(tokenId)` and exclude burned or invalid IDs. For production, prefer a maintained indexer or a backend service instead of a large browser-side historical scan.

## Contract integration gate

The Direct Claim ABI and verified source were not available to the project authoring process. No claim method, eligibility method, used-token method, event signature, parameter order, or return shape is assumed here. Before enabling transactions:

1. Retrieve the exact verified source and ABI for the configured Direct Claim address on BscScan.
2. Inspect the NFT and token source as well as any proxy/implementation relationship.
3. Confirm the exact claim method, arguments, return values, events, eligibility rules, one-time-use storage, and ownership checks.
4. Confirm the reward amount and token transfer behavior against deployed code.
5. Add the reviewed ABI and an adapter with explicit typed read/write methods.
6. Test on a fork or test environment, then validate the exact calldata and expected state changes before production release.

The UI must remain read-only and must not submit a transaction while this gate is incomplete.

## Transaction safety

- Require chain ID 56 and a connected wallet.
- Display selected token IDs, complete group count, estimated reward, remaining NFTs, contract address, and available gas information before a transaction.
- Simulate or estimate gas using the verified method where supported.
- Require a clear user action and wallet confirmation for every transaction.
- Never sign, send, or retry a transaction automatically.
- Wait for a successful receipt before reporting success.
- Refresh token balance, ownership, eligibility, and claim history after confirmation.
- Link a confirmed transaction hash to `https://bscscan.com/tx/{hash}`.
- If the transaction reverts or receipt status is unsuccessful, report failure without claiming that assets were consumed.

## Privacy and prohibited behavior

Never ask for or accept a private key or seed phrase. Never invent balances, NFT IDs, eligibility, transaction hashes, claim history, or contract behavior. Never claim a transaction succeeded without a successful on-chain receipt. Never recommend bypassing contract restrictions or transferring assets to evade eligibility.

## Error handling

Explain errors in plain language. For a wrong network, ask the user to switch to BNB Smart Chain. For missing deployment block/indexer configuration, explain that NFT discovery is unavailable. For RPC throttling, retry with bounded backoff and report when retries are exhausted. For missing or unverified ABI methods, keep claiming disabled and direct maintainers to verify deployed source. For insufficient eligible NFTs, explain that only complete groups of three qualify and partial groups remain for future claims.

## Future backend contract

A future backend should expose authenticated, rate-limited, chain-aware read endpoints for owned token IDs, verified eligibility, used status, and claim history. It should return block numbers and data provenance so the UI can identify stale reads. The backend must never custody user keys or submit transactions on the user's behalf. Wallet signing remains in the user's wallet.
