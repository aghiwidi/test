export const CHAIN_ID = 56;
export const CHAIN_HEX = '0x38';
export const CONTRACTS = {
  token: '0x9D0F4E3387a585D6DF774b76d496D85C03E15237',
  nft: '0x7946d1F5D498116748C4168Ec23161FEfebDce37',
  directClaim: '0xc5EBE5e02f787837236A1D419CCEf30dF72d38C2',
} as const;
export const BSC_RPC = import.meta.env.VITE_BSC_RPC_URL || 'https://bsc-dataseed.binance.org';
export const DEPLOYMENT_BLOCK = import.meta.env.VITE_ASCEND_DEPLOYMENT_BLOCK;
export const TOKEN_DECIMALS = 18;
