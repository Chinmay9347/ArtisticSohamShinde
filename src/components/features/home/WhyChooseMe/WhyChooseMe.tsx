import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

import { features } from "./WhyChooseMe.data";
import { FeatureCard } from "./FeatureCard";
import { whyChooseStyles } from "./WhyChooseMe.styles";

export function WhyChooseMe() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Why Choose Me"
          title="Craftsmanship That Makes Every Portrait Special"
          description="Every portrait is created with passion, precision, and a commitment to preserving your memories beautifully."
          align="center"
        />

        <div className={whyChooseStyles.grid}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}