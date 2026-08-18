import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { ContactCTAProps } from "./ContactCTA.types";
import { contactCTAStyles as styles } from "./ContactCTA.styles";

export function ContactCTA({
  title,
  description,
}: ContactCTAProps) {
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
            href="/commission"
            className={styles.primaryButton}
          >
            Commission a Portrait
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