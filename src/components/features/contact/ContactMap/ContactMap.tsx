import { MapPinned } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { ContactMapProps } from "./ContactMap.types";
import { contactMapStyles as styles } from "./ContactMap.styles";

export function ContactMap({
  address,
}: ContactMapProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <h2 className={styles.heading}>
          Visit the Studio
        </h2>

        <p className={styles.subtitle}>
          If you're nearby, you're welcome to get in touch before visiting.
        </p>

        <div className={styles.map}>
          <div className={styles.placeholder}>
            <MapPinned
              size={56}
              className={styles.icon}
            />

            <p className={styles.address}>
              {address}
            </p>

            <p className={styles.note}>
              Interactive Google Maps integration will be
              added in a future update.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}