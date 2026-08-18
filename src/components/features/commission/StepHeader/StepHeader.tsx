"use client";

import { styles } from "./StepHeader.styles";

import type {
  StepHeaderProps,
} from "./StepHeader.types";

export function StepHeader({
  currentStep,
  totalSteps,
  title,
  description,
}: StepHeaderProps) {
  return (
    <header className={styles.container}>
      <span className={styles.step}>
        Step {currentStep} of {totalSteps}
      </span>

      <h2 className={styles.title}>
        {title}
      </h2>

      <p className={styles.description}>
        {description}
      </p>
    </header>
  );
}