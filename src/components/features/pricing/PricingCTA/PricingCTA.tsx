import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { PricingCTAProps } from "./PricingCTA.types";
import { pricingCTAStyles as styles } from "./PricingCTA.styles";

export function PricingCTA({
  title,
  description,
}: PricingCTAProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <h2 className={styles.title}>
          {title}
        </h2>

        <p className={styles.description}>
          {description}
        </p>

        <div className={styles.buttonWrapper}>
          <Link
            href="/commission"
            className={styles.primaryButton}
          >
            Order Your Portrait
          </Link>

          <Link
            href="/contact"
            className={styles.secondaryButton}
          >
            Contact Me
          </Link>
        </div>
      </Container>
    </Section>
  );
}