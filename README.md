# AGENTKEY Website

A React, Vite, TypeScript and ethers.js website for the AGENTKEY ecosystem on BNB Smart Chain. Korean is the default UI language; English is available through the language switcher.

## Features

- Custom AGENTKEY SVG brand mark and favicon.
- Responsive dark forest-green interface with lime accents.
- Home, dashboard and Direct Claim pages.
- Korean/English translations using a single translation dictionary.
- Injected EVM wallet connection, account/chain change handling, network switching and disconnect.
- Live BNB and KRVN balance reads on BNB Smart Chain (chain ID 56).
- Ascend NFT discovery using either a configured indexer or paginated Transfer log scanning, followed by `ownerOf` verification.
- Explicit claim safety gate: the UI does not submit transactions until the actual deployed Direct Claim ABI and eligibility/usage methods have been reviewed and configured.
- English AI agent prompts and skill documentation.

## Requirements

- Node.js 20 or newer (recommended).
- npm 10 or newer.
- An injected EVM wallet for wallet-connected functionality.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Build and type-check:

```bash
npm run typecheck
npm run build
npm run preview
```

## Environment configuration

See `.env.example`.

- `VITE_BSC_RPC_URL`: BNB Smart Chain JSON-RPC endpoint. The public endpoint fallback is for development only; use a reliable provider for production.
- `VITE_ASCEND_DEPLOYMENT_BLOCK`: the authoritative NFT deployment block. This value is deliberately blank. Obtain it from deployment records; never guess it.
- `VITE_NFT_INDEXER_URL`: optional production indexer endpoint. The current client expects a GET endpoint accepting `chainId`, `contractAddress`, and `owner` query parameters and returning a JSON array of token IDs. Adapt the service to the selected provider's documented schema before production use.
- `VITE_DIRECT_CLAIM_ABI_URL`: reserved for future verified integration. No guessed ABI is included.
- `VITE_AI_API_URL`: optional future AI backend URL. Provider API keys must remain on the server and must not use a `VITE_` variable.

## Contract addresses

| Contract | Address |
|---|---|
| KRYVON (KRVN) | `0x9D0F4E3387a585D6DF774b76d496D85C03E15237` |
| AgentKey Ascend NFT | `0x7946d1F5D498116748C4168Ec23161FEfebDce37` |
| Direct Claim | `0xc5EBE5e02f787837236A1D419CCEf30dF72d38C2` |

Network: BNB Smart Chain mainnet, chain ID 56. The app does not deploy, modify, or replace these contracts.

## Direct Claim: production blocker and required verification

The deployed Direct Claim source/ABI was not available for review during this project build. Therefore the repository intentionally does **not** guess a claim function, argument layout, eligibility method, used-NFT mapping, or event signature. Claim submission is disabled. The page shows the stated reward calculation as an estimate based on the user's selection, not a verified claim quote.

Before enabling claim writes, a maintainer must:

1. Retrieve the exact verified source and ABI from BscScan for the Direct Claim address.
2. Review the NFT and token contracts, and resolve any proxy implementation.
3. Confirm the actual claim method, argument order, eligibility checks, one-time-use storage, event definitions, token transfer behavior and revert conditions.
4. Add the exact reviewed ABI and implement `src/contracts/directClaimAdapter.ts` with typed read/write functions.
5. Add tests against a fork/test environment and verify exact calldata, gas estimation and post-transaction state.
6. Enable the UI only when the adapter is explicitly marked ready.

BscScan contract links:

- [KRYVON token](https://bscscan.com/address/0x9D0F4E3387a585D6DF774b76d496D85C03E15237)
- [AgentKey Ascend NFT](https://bscscan.com/address/0x7946d1F5D498116748C4168Ec23161FEfebDce37)
- [Direct Claim](https://bscscan.com/address/0xc5EBE5e02f787837236A1D419CCEf30dF72d38C2)

## NFT discovery

The NFT contract does not implement ERC721Enumerable. The app can:

- Query a configured indexer; or
- Scan ERC-721 `Transfer` logs in RPC pages beginning at the configured deployment block, with bounded retries and delays; then
- Verify every candidate with `ownerOf(tokenId)`.

The deployment block is intentionally unset. A browser-based historical scan may be expensive and is not the recommended production architecture. Use a reliable indexer/backend with pagination, caching, reorg handling and rate limits for production. The current sample indexer adapter expects a simple array response and must be adapted to the selected provider's official API.

Eligibility and prior usage are separate from ownership. The current app does not claim that owned NFTs are eligible or unused.

## Wallet safety

- Uses the injected EVM wallet through ethers.js.
- No private keys or seed phrases are requested or stored.
- Wallet transactions are not automatically submitted.
- The current claim control is disabled pending verified contract integration.
- Balance reads are live RPC reads; errors are shown rather than replaced with fabricated values.

## AI agent integration

The following files are English-only and intended for a future backend/agent runtime:

- `skills/kryvon-direct-claim/skill.md`
- `prompts/direct-claim.md`
- `prompts/agentkey-system.md`

No live AI backend is included. A future server should validate wallet context and read-only chain data, apply rate limits, and keep model-provider credentials server-side. It must never custody user keys or submit transactions on behalf of a user.

## Public identity and metadata

The public identity is AGENTKEY. This project avoids embedding personal developer details. This is metadata minimization, not a guarantee of anonymity; DNS, RDAP/WHOIS, hosting providers, blockchain explorers and external services may expose technical information.

## Repository layout

```text
agentkey-website/
├── public/                 # Brand assets
├── src/
│   ├── components/         # Shared UI
│   ├── contracts/          # Addresses, standard read ABIs, claim safety gate
│   ├── hooks/              # Wallet state
│   ├── i18n/               # Korean and English dictionary
│   ├── pages/              # Home, dashboard, Direct Claim
│   ├── services/           # RPC and NFT discovery
│   ├── App.tsx
│   └── styles.css
├── skills/                 # English agent skills
├── prompts/                # English AI prompts
├── docs/
├── .env.example
└── README.md
```

## License

No license is granted by this repository unless a license file is added by the project owner.
