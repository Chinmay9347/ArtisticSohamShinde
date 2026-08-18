"use client";

import { styles } from "./ProgressBar.styles";
import type { ProgressBarProps } from "./ProgressBar.types";

export function ProgressBar({
  commission,
}: ProgressBarProps) {
  const currentStep = commission.currentStep;
  const totalSteps = commission.steps.length;

  const progress =
    ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className={styles.label}>
        Step {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
}