import {
  BusinessHours,
  ContactFAQItem,
  ContactInfo,
  SocialLink,
} from "@/types/contact";

export const contactInfo: ContactInfo[] = [
  {
    title: "Phone",
    value: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
    icon: "Phone",
  },

  {
    title: "Email",
    value: "artist@example.com",
    href: "mailto:artist@example.com",
    icon: "Mail",
  },

  {
    title: "Location",
    value: "Pune, Maharashtra, India",
    icon: "MapPin",
  },

  {
    title: "Working Hours",
    value: "Mon - Sat • 10:00 AM - 8:00 PM",
    icon: "Clock",
  },
];

export const socialLinks: SocialLink[] = [
  {
    id: 1,
    platform: "Instagram",
    url: "https://instagram.com/artistic_soham_shinde_",
  },

  {
    id: 2,
    platform: "WhatsApp",
    url: "https://wa.me/91XXXXXXXXXX",
  },

  {
    id: 3,
    platform: "Facebook",
    url: "#",
  },

  {
    id: 4,
    platform: "YouTube",
    url: "#",
  },
];

export const businessHours: BusinessHours[] = [
  {
    day: "Monday - Friday",
    time: "10:00 AM - 8:00 PM",
  },

  {
    day: "Saturday",
    time: "10:00 AM - 6:00 PM",
  },

  {
    day: "Sunday",
    time: "By Appointment",
  },
];

export const contactFAQs: ContactFAQItem[] = [
  {
    id: 1,
    question: "How can I place a portrait order?",
    answer:
      "You can place an order through the Commission page or contact us directly using the information below.",
  },

  {
    id: 2,
    question: "How quickly do you respond?",
    answer:
      "Most enquiries receive a response within 24 hours.",
  },

  {
    id: 3,
    question: "Can I discuss a custom requirement?",
    answer:
      "Absolutely. Every commission is unique, and custom requests are always welcome.",
  },

  {
    id: 4,
    question: "Do you accept urgent orders?",
    answer:
      "Yes, depending on our current schedule. Please contact us before placing an urgent order.",
  },
];