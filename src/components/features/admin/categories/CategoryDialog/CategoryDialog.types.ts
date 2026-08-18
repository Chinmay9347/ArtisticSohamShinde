export interface CategoryDialogProps {
  open: boolean;
  onClose(): void;
  onCreated(): Promise<void>;
}