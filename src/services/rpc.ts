import { JsonRpcProvider } from 'ethers';
import { BSC_RPC } from '../contracts/config';
export const readProvider = new JsonRpcProvider(BSC_RPC, 56, { staticNetwork: true });
