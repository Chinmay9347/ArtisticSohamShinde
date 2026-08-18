import type { PricingAddon, PricingPlan } from "@/types/pricing";
import type { PricingFAQItem } from "@/components/features/pricing/PricingFAQ/PricingFAQ.types";

export const pricingPlans: PricingPlan[] = [
  { id:"classic", title:"Classic", size:"A5", dimensions:"5.8 × 8.3 in", originalPrice:2499, discount:64.03, subjectsIncluded:1, additionalSubjectPrice:700, frameIncluded:false, deliveryTime:"7–10 Days", medium:"Graphite Pencil", recommended:false, features:["Premium Pencil Portrait","High Quality Paper","Protective Packaging","Certificate of Authenticity"] },
  { id:"premium", title:"Premium", size:"A4", dimensions:"8.3 × 11.7 in", originalPrice:3499, discount:62.88, subjectsIncluded:2, additionalSubjectPrice:900, frameIncluded:false, deliveryTime:"7–12 Days", medium:"Graphite Pencil", recommended:true, features:["Most Popular","Premium Paper","Fine Detail Finish","Protective Packaging","Certificate of Authenticity"] },
  { id:"luxury", title:"Luxury", size:"A3", dimensions:"11.7 × 16.5 in", originalPrice:4499, discount:62.24, subjectsIncluded:3, additionalSubjectPrice:1200, frameIncluded:false, deliveryTime:"10–14 Days", medium:"Graphite Pencil", recommended:false, features:["Museum Quality Finish","Maximum Detail","Premium Packaging","Certificate of Authenticity"] },
  { id:"royal", title:"Royal", size:"A2", dimensions:"16.5 × 23.4 in", originalPrice:6999, discount:67.15, subjectsIncluded:4, additionalSubjectPrice:1500, frameIncluded:false, deliveryTime:"14–21 Days", medium:"Graphite Pencil", recommended:false, features:["Gallery Grade Artwork","Maximum Detail","Premium Packaging","Certificate of Authenticity"] },
];

export const pricingAddons: PricingAddon[] = [
  {id:1,title:"Extra Subject",description:"Add one additional person or pet.",price:700},
  {id:2,title:"Premium Frame",description:"Elegant premium wooden frame.",price:1500},
  {id:3,title:"Gift Packaging",description:"Luxury gift wrapping.",price:500},
  {id:4,title:"Express Delivery",description:"Priority completion and dispatch.",price:1200},
  {id:5,title:"Digital Copy",description:"High-resolution scanned artwork.",price:800},
];

export const pricingFAQs: PricingFAQItem[] = [
 {id:1,question:"How many reference photos should I provide?",answer:"You can provide one or more clear, high-resolution photos. Multiple reference images help achieve better accuracy and detail."},
 {id:2,question:"Do you ship across India?",answer:"Yes. Portraits are securely packaged and shipped across India. International shipping will be available in the future."},
 {id:3,question:"Can I request revisions?",answer:"Yes. Minor revisions are included before the final artwork is dispatched."},
 {id:4,question:"How long does it take?",answer:"Delivery time depends on the selected portrait size and current workload. Estimated delivery is shown for each pricing plan."},
 {id:5,question:"Which payment methods are accepted?",answer:"Currently, UPI and Bank Transfer are accepted. Additional payment options will be introduced later."},
];
