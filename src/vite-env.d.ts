/// <reference types="vite/client" />
interface ImportMetaEnv { readonly VITE_BSC_RPC_URL?: string; readonly VITE_ASCEND_DEPLOYMENT_BLOCK?: string; readonly VITE_NFT_INDEXER_URL?: string; readonly VITE_DIRECT_CLAIM_ABI_URL?: string; readonly VITE_AI_API_URL?: string }
interface ImportMeta { readonly env: ImportMetaEnv }
