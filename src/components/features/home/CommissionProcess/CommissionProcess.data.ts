//12/07/2026 0.0v
import { ProcessStep } from "./CommissionProcess.types";

export const processSteps: ProcessStep[] = [
  {
    id: 1,
    step: "01",
    title: "Share Your Photo",
    description:
      "Upload or send a clear reference photograph for your custom portrait.",
  },
  {
    id: 2,
    step: "02",
    title: "Discuss Requirements",
    description:
      "Select portrait size, number of subjects, background preferences, and framing options.",
  },
  {
    id: 3,
    step: "03",
    title: "Artwork Creation",
    description:
      "Your portrait is handcrafted using premium-quality graphite pencils with great attention to detail.",
  },
  {
    id: 4,
    step: "04",
    title: "Packaging & Delivery",
    description:
      "Your artwork is securely packaged and carefully delivered to your location.",
  },
];

export const commissionProcessCTA = {
  label: "Begin Your Custom Portrait",
  href: "/commission",
};

// import { ProcessStep } from "./CommissionProcess.types";

// export const processSteps: ProcessStep[] = [
//   {
//     id: 1,
//     step: "01",
//     title: "Share Your Photo",
//     description:
//       "Upload or send a clear reference photograph for your custom portrait.",
//   },
//   {
//     id: 2,
//     step: "02",
//     title: "Discuss Requirements",
//     description:
//       "Select portrait size, number of subjects, background preferences, and framing options.",
//   },
//   {
//     id: 3,
//     step: "03",
//     title: "Artwork Creation",
//     description:
//       "Your portrait is handcrafted using premium-quality graphite pencils with great attention to detail.",
//   },
//   {
//     id: 4,
//     step: "04",
//     title: "Packaging & Delivery",
//     description:
//       "Your artwork is securely packaged and carefully delivered to your location.",
//   },
// ];