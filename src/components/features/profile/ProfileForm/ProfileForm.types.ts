export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  bio: string;

  preferredContact:
    | "EMAIL"
    | "WHATSAPP"
    | "PHONE";
}