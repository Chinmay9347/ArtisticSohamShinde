import { SITE_ASSETS } from "@/constants/site-assets";

import {
  ArtistInfo,
  BehindPortrait,
  WebsiteDeveloper,
  WhyChooseItem,
} from "@/types/about";

export const artistInfo: ArtistInfo = {
  name: "Soham Shinde",

  title: "Portrait Artist",

  location: "Pune, Maharashtra, India",

  description: [
    "Hi, I'm Soham Shinde, a portrait artist from Pune, India, specializing in realistic hand-drawn pencil and charcoal portraits.",

    "Every portrait I create is carefully handcrafted with precision, patience, and attention to detail, capturing not only the likeness of the subject but also the emotions and memories behind every face.",

    "I believe every portrait tells a unique story, and my goal is to transform those cherished moments into timeless works of art.",

    "Whether it's a heartfelt gift for a loved one, a family portrait, a beloved pet, or a favorite personality, each artwork is created using premium-quality materials to ensure exceptional quality and lasting beauty.",

    "Through Artistic Soham Shinde, I am committed to delivering artwork that combines realism, craftsmanship, and a memorable customer experience from the first conversation to the final delivery.",

    "Every portrait is more than a drawing—it's a memory preserved forever.",
  ],

  signature: "— Soham Shinde",
};

export const whyChooseItems: WhyChooseItem[] = [
  {
    id: 1,
    title: "100% Hand Drawn",
    description:
      "Every portrait is created entirely by hand without digital tracing.",
    icon: "Pencil",
  },

  {
    id: 2,
    title: "Premium Materials",
    description:
      "Only professional-grade graphite, charcoal, and archival paper are used.",
    icon: "Sparkles",
  },

  {
    id: 3,
    title: "Secure Packaging",
    description:
      "Artwork is carefully packed to ensure safe delivery.",
    icon: "Package",
  },

  {
    id: 4,
    title: "Personalized Artwork",
    description:
      "Every commission is uniquely crafted to match your memories.",
    icon: "Heart",
  },
];

export const behindPortrait: BehindPortrait = {
  title: "Behind Every Portrait",

  description:
    "Every artwork begins with a story. From selecting the finest reference images to adding the final pencil strokes, each portrait is created with patience, passion, and dedication to preserving your most meaningful memories.",

  image: SITE_ASSETS.behindPortrait,
};

export const websiteDeveloper: WebsiteDeveloper = {
  title: "Website Design & Development",

  developer: "Software.Hardware.Project.CK",

  description: [
    "This website has been thoughtfully designed and developed by Chinmay Kumbhar.",

    "Built using Next.js, TypeScript, and Tailwind CSS, it provides a premium, responsive, and user-friendly experience.",

    "Software.Hardware.Project.CK develops modern software applications, embedded systems, IoT solutions, automation projects, and intelligent engineering systems.",
  ],

  github: "https://github.com/Chinmay9347",

  linkedin: "https://www.linkedin.com/in/chinmay-kumbhar-24159b261/",

  instagram:
    "https://www.instagram.com/software.hardware.projects/",

  whatsapp:
    "https://whatsapp.com/channel/0029VbCBTRUFXUuTA1BnvP11",
};