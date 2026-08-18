import {
  HeartHandshake,
  PackageCheck,
  Palette,
  PencilRuler,
} from "lucide-react";

import { Feature } from "./WhyChooseMe.types";
import { whyChooseStyles } from "./WhyChooseMe.styles";

interface Props {
  feature: Feature;
}

const icons = {
  handcrafted: <PencilRuler className="h-8 w-8 text-[#C9A227]" />,
  materials: <Palette className="h-8 w-8 text-[#C9A227]" />,
  custom: <HeartHandshake className="h-8 w-8 text-[#C9A227]" />,
  delivery: <PackageCheck className="h-8 w-8 text-[#C9A227]" />,
};

export function FeatureCard({ feature }: Props) {
  return (
    <article className={whyChooseStyles.card}>
      <div className={whyChooseStyles.icon}>
        {icons[feature.icon]}
      </div>

      <h3 className={whyChooseStyles.title}>
        {feature.title}
      </h3>

      <p className={whyChooseStyles.description}>
        {feature.description}
      </p>
    </article>
  );
}