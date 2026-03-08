import { Deduction } from '@/types/story';

export function computeUnlockedDeductions(deductions: Deduction[], inventory: string[]) {
  return deductions
    .filter((deduction) => deduction.unlockedBy.every((itemId) => inventory.includes(itemId)))
    .map((deduction) => deduction.id);
}
