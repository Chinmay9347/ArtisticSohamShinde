export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: "handcrafted" | "materials" | "custom" | "delivery";
}