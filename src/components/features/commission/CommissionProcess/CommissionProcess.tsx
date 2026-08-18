import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { CommissionProcessProps } from "./CommissionProcess.types";
import { commissionProcessStyles as styles } from "./CommissionProcess.styles";

export function CommissionProcess({
  steps,
}: CommissionProcessProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <h2 className={styles.heading}>
          How It Works
        </h2>

        <p className={styles.subtitle}>
          Ordering a custom portrait is simple.
          Follow these four steps and let us turn
          your memories into timeless artwork.
        </p>

        <div className={styles.timeline}>
          <div className={styles.line} />

          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.item} ${
                index % 2 === 0
                  ? styles.left
                  : styles.right
              }`}
            >
              <div className={styles.number}>
                {step.id}
              </div>

              <div className={styles.content}>
                <h3 className={styles.title}>
                  {step.title}
                </h3>

                <p className={styles.description}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}