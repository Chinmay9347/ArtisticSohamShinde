/**
 * Generates:
 *
 * AS-2026-000001
 */

export function generateOrderNumber(sequence: number): string {
  const year = new Date().getFullYear();

  return `AS-${year}-${sequence
    .toString()
    .padStart(6, "0")}`;
}