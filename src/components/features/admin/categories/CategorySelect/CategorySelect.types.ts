export interface CategoryOption {
  id: string;
  name: string;
}

export interface CategorySelectProps {
  value: string;
  options: CategoryOption[];
  loading?: boolean;
  disabled?: boolean;
  onChange(value: string): void;
}