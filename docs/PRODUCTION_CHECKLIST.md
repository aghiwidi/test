# Production Readiness Checklist

- [ ] Confirm the exact deployed contract source/ABI and any proxy implementation.
- [ ] Confirm the NFT deployment block from deployment records.
- [ ] Configure a reliable BNB Chain RPC provider.
- [ ] Select and configure a production NFT indexer; adapt its response schema and pagination.
- [ ] Implement verified Direct Claim read methods and one-time-use checks.
- [ ] Implement the exact verified claim transaction method; add fork tests and transaction simulation.
- [ ] Confirm whether NFT soulbound restrictions are enforced by deployed code, not only project policy.
- [ ] Add verified claim-history event parsing.
- [ ] Add monitoring for RPC/indexer errors and stale indexer data.
- [ ] Configure and secure a server-side AI backend if required.
- [ ] Run dependency/security scans and deploy behind HTTPS.
- [ ] Test wallet rejection, wrong network, account changes, chain changes, RPC failures and transaction reverts.
