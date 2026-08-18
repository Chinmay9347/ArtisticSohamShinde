import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { BehindPortraitProps } from "./BehindPortrait.types";
import { behindPortraitStyles as styles } from "./BehindPortrait.styles";

export function BehindPortrait({
  data,
}: BehindPortraitProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <div className={styles.wrapper}>
          <Image
            src={data.image}
            alt={data.title}
            width={1600}
            height={900}
            className={styles.image}
          />

          <div className={styles.overlay} />

          <div className={styles.content}>
            <h2 className={styles.title}>
              {data.title}
            </h2>

            <p className={styles.description}>
              {data.description}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}