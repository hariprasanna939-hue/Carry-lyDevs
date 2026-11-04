import { CONSTANTS } from '../../config/constants';

export function calculateHelperFee(helperCount: number): number {
  if (helperCount <= 0) return 0;
  return helperCount * CONSTANTS.HELPER_COST_PER_PERSON;
}
