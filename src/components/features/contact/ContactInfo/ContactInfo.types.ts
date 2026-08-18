import { BusinessHours, ContactInfo, SocialLink } from "@/types/contact";

export interface ContactInfoProps {
  contactInfo: ContactInfo[];
  businessHours: BusinessHours[];
  socialLinks: SocialLink[];
}