import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { ContactInfoProps } from "./ContactInfo.types";
import { contactInfoStyles as styles } from "./ContactInfo.styles";

const icons = {
  Phone,
  Mail,
  MapPin,
  Clock,
};

export function ContactInfo({
  contactInfo,
  businessHours,
  socialLinks,
}: ContactInfoProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <h2 className={styles.heading}>
          Get In Touch
        </h2>

        <p className={styles.subtitle}>
          Whether you have questions about commissions,
          pricing, or custom artwork, I'd be happy to
          hear from you.
        </p>

        <div className={styles.grid}>
          {contactInfo.map((item) => {
            const Icon =
              icons[item.icon as keyof typeof icons];

            return (
              <div
                key={item.title}
                className={styles.card}
              >
                <div className={styles.icon}>
                  {Icon && <Icon size={34} />}
                </div>

                <h3 className={styles.cardTitle}>
                  {item.title}
                </h3>

                {item.href ? (
                  <Link
                    href={item.href}
                    className={`${styles.cardValue} ${styles.link}`}
                  >
                    {item.value}
                  </Link>
                ) : (
                  <p className={styles.cardValue}>
                    {item.value}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.hoursSection}>
          <h3 className={styles.hoursHeading}>
            Business Hours
          </h3>

          <div className={styles.hoursList}>
            {businessHours.map((item) => (
              <div
                key={item.day}
                className={styles.hourRow}
              >
                <span className={styles.day}>
                  {item.day}
                </span>

                <span className={styles.time}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.socialSection}>
          <h3 className={styles.socialHeading}>
            Follow Artistic Soham
          </h3>

          <div className={styles.socialList}>
            {socialLinks.map((social) => (
              <Link
                key={social.id}
                href={social.url}
                target="_blank"
                className={styles.socialButton}
              >
                {social.platform}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}