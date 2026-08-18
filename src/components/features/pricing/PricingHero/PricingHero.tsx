import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { pricingHeroStyles as styles } from "./PricingHero.styles";
import { PricingHeroProps } from "./PricingHero.types";

export function PricingHero({
  title,
  subtitle,
}: PricingHeroProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <h1 className={styles.title}>
          {title}
        </h1>

        <div className={styles.divider} />

        <p className={styles.subtitle}>
          {subtitle}
        </p>
      </Container>
    </Section>
  );
}