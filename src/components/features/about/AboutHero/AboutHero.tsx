import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { AboutHeroProps } from "./AboutHero.types";
import { aboutHeroStyles as styles } from "./AboutHero.styles";

export function AboutHero({
  title,
  heading,
  description,
}: AboutHeroProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <p className={styles.title}>
          {title}
        </p>

        <h1 className={styles.heading}>
          {heading}
        </h1>

        <div className={styles.divider} />

        <p className={styles.description}>
          {description}
        </p>
      </Container>
    </Section>
  );
}