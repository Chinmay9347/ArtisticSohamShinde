import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { commissionHeroStyles as styles } from "./CommissionHero.styles";
import { CommissionHeroProps } from "./CommissionHero.types";

export function CommissionHero({
  title,
  subtitle,
}: CommissionHeroProps) {
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