export type UserRole =
  | "CUSTOMER"
  | "ADMIN"
  | "ARTIST";


export interface SavedAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  bio: string;
  emailVerified: boolean;
  firstLoginCompleted: boolean;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  isActive: boolean;
  loginCount?: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSaved: number;
  loyaltyPoints: number;
  referralRewardCoins?: number;
  referralRewardCoinsSpent?: number;
  referralRewardsEarned?: number;
  preferredContact: "EMAIL" | "PHONE" | "WHATSAPP";
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  createdAt: unknown;
  updatedAt: unknown;
  lastLogin: unknown;
}
