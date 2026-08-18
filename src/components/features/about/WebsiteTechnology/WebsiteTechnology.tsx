import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { WebsiteTechnologyProps } from "./WebsiteTechnology.types";
import { websiteTechnologyStyles as styles } from "./WebsiteTechnology.styles";

export function WebsiteTechnology({
  developer,
}: WebsiteTechnologyProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <h2 className={styles.heading}>
              {developer.title}
            </h2>

            <h3 className={styles.developer}>
              {developer.developer}
            </h3>

            {developer.description.map((paragraph, index) => (
              <p
                key={index}
                className={styles.paragraph}
              >
                {paragraph}
              </p>
            ))}

            <h4 className={styles.techTitle}>
              Technologies Used
            </h4>

            <div className={styles.techList}>
              <span className={styles.techBadge}>Next.js</span>
              <span className={styles.techBadge}>TypeScript</span>
              <span className={styles.techBadge}>Tailwind CSS</span>
              <span className={styles.techBadge}>React</span>
            </div>
          </div>

          <div className={styles.right}>
            <h3 className={styles.techTitle}>
              Connect With Me
            </h3>

            <div className={styles.socialList}>
              <Link
                href={developer.github}
                target="_blank"
                className={styles.socialLink}
              >
                GitHub
              </Link>

              <Link
                href={developer.linkedin}
                target="_blank"
                className={styles.socialLink}
              >
                LinkedIn
              </Link>

              <Link
                href={developer.instagram}
                target="_blank"
                className={styles.socialLink}
              >
                Instagram
              </Link>

              <Link
                href={developer.whatsapp}
                target="_blank"
                className={styles.socialLink}
              >
                WhatsApp Channel
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}