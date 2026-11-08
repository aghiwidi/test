// Minimal standard interfaces only. These are used for standard ERC-20 reads and ERC-721 ownerOf.
// The Direct Claim ABI is deliberately omitted until verified deployed source is reviewed.
export const ERC20_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
];
export const ERC721_READ_ABI = ['function ownerOf(uint256 tokenId) view returns (address)'];
