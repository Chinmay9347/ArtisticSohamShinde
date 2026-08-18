import {
  CommissionFAQItem,
  CommissionStep,
  PortraitOption,
  // PortraitSize,
} from "@/types/commission";

export const commissionSteps: CommissionStep[] = [
  {
    id: 1,
    title: "Choose Your Portrait",
    description:
      "Select the portrait size and style that best suits your requirements.",
  },
  {
    id: 2,
    title: "Upload Reference Photos",
    description:
      "Upload clear, high-quality reference images for the best artistic results.",
  },
  {
    id: 3,
    title: "Artwork Creation",
    description:
      "Your portrait is handcrafted with precision using premium graphite pencils.",
  },
  {
    id: 4,
    title: "Delivery",
    description:
      "Your finished artwork is carefully packed and shipped safely to your doorstep.",
  },
];

export const portraitOptions: PortraitOption[] = [
  {
    id: 1,
    title: "Single Portrait",
    description: "Perfect for individuals.",
  },
  {
    id: 2,
    title: "Couple Portrait",
    description: "Celebrate memorable moments together.",
  },
  {
    id: 3,
    title: "Family Portrait",
    description: "Beautiful artwork for the entire family.",
  },
  {
    id: 4,
    title: "Pet Portrait",
    description: "Hand-drawn portraits of your beloved pets.",
  },
];

export const commissionFAQs: CommissionFAQItem[] = [
  {
    id: 1,
    question: "Can I upload multiple reference photos?",
    answer:
      "Yes. Multiple reference images help achieve better likeness and details.",
  },
  {
    id: 2,
    question: "Will I receive progress updates?",
    answer:
      "Yes. Important progress updates can be shared before the final delivery.",
  },
  {
    id: 3,
    question: "Can I request changes?",
    answer:
      "Minor revisions are included before the artwork is finalized.",
  },
];