import type { CommissionContextType } from "@/types/commission";

export interface NavigationButtonsProps {
  commission: CommissionContextType;

  submitLabel?: string;

  loading?: boolean;
  
  disabled?: boolean;

  onSubmit?: () => void;
}