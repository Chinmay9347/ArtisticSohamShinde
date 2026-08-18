export interface ContactInfo {
  title: string;
  value: string;
  href?: string;
  icon: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

export interface ContactFAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface BusinessHours {
  day: string;
  time: string;
}