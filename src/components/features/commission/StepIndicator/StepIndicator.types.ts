import type { CommissionStepItem } from "@/types/commission";

export interface StepIndicatorProps {
  steps: CommissionStepItem[];
  currentStep: number;
}