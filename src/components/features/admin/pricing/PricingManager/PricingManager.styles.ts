/**
 * Admin Pricing Manager styles.
 *
 * IMPORTANT:
 * Keep pricing-admin styles isolated from the customer commission
 * styles. Do not reuse CustomerStep.styles.ts here.
 */
export const pricingManagerStyles = {
  container: "space-y-8",

  header: "space-y-2",

  title: "text-2xl font-semibold text-neutral-900",

  description: "text-sm text-neutral-500",

  packageGrid: "grid gap-4 md:grid-cols-4",

  packageButton:
    "rounded-xl border border-neutral-300 bg-white px-4 py-3 text-left transition hover:border-[#C9A227] hover:bg-[#C9A227]/5",

  packageButtonActive:
    "rounded-xl border border-[#C9A227] bg-[#C9A227]/10 px-4 py-3 text-left shadow-sm",

  packageName:
    "font-semibold text-neutral-900",

  packageSize:
    "mt-1 text-sm text-neutral-500",

  section:
    "space-y-6 rounded-2xl border border-neutral-200 bg-white p-6",

  sectionTitle:
    "text-lg font-semibold text-neutral-900",

  sectionDescription:
    "text-sm text-neutral-500",

  grid:
    "grid gap-5 md:grid-cols-2",

  field:
    "space-y-2",

  label:
    "block text-sm font-medium text-neutral-700",

  input:
    "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20",

  checkboxRow:
    "flex items-center gap-3",

  checkbox:
    "h-4 w-4 rounded border-neutral-300",

  actions:
    "flex justify-end",

  saveButton:
    "rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",

  copyGrid:
    "grid gap-5 md:grid-cols-2 lg:grid-cols-4",

  copyAction:
    "flex items-end",

  copyButton:
    "w-full rounded-xl border border-[#C9A227] bg-[#C9A227]/10 px-6 py-3 font-semibold text-neutral-900 transition hover:bg-[#C9A227]/20 disabled:cursor-not-allowed disabled:opacity-50",

  copyMessage:
    "text-sm text-neutral-600",
};