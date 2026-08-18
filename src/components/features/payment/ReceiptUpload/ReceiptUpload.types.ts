export interface ReceiptUploadProps {
  onFileSelected: (file: File | null) => void;

  selectedFile?: File | null;

  uploading?: boolean;
}