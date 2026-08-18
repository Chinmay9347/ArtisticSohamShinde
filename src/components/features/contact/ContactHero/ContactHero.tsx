import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { ContactHeroProps } from "./ContactHero.types";
import { contactHeroStyles as styles } from "./ContactHero.styles";

export function ContactHero({
  title,
  heading,
  description,
}: ContactHeroProps) {
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