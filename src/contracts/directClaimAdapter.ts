/**
 * Safety gate for the deployed Direct Claim integration.
 * Populate only after reviewing the exact verified source/ABI at the configured address.
 * Do not infer function names, tuple layouts, event signatures, or claim semantics.
 */
export type ClaimIntegrationStatus = 'unconfigured' | 'ready';
export interface VerifiedClaimAdapter {
  status: ClaimIntegrationStatus;
  reason: string;
}
export const directClaimAdapter: VerifiedClaimAdapter = {
  status: 'unconfigured',
  reason: 'The deployed Direct Claim ABI and eligibility/consumption methods have not yet been supplied and independently reviewed. Claim submission is disabled.',
};
