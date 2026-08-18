import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { CommissionCTAProps } from "./CommissionCTA.types";
import { commissionCTAStyles as styles } from "./CommissionCTA.styles";

export function CommissionCTA({
  title,
  description,
}: CommissionCTAProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <h2 className={styles.title}>
          {title}
        </h2>

        <p className={styles.description}>
          {description}
        </p>

        <div className={styles.buttonGroup}>
          <Link
            href="/contact"
            className={styles.primaryButton}
          >
            Contact Me
          </Link>

          <Link
            href="/gallery"
            className={styles.secondaryButton}
          >
            View Gallery
          </Link>
        </div>
      </Container>
    </Section>
  );
}