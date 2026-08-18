export interface PaymentAccountDeleteDialogProps {
  open: boolean;

  accountTitle: string;

  loading?: boolean;

  onClose: () => void;

  onConfirm: () => Promise<void>;
}