"use client";

import { Check } from "lucide-react";

import { styles } from "./StepIndicator.styles";
import type { StepIndicatorProps } from "./StepIndicator.types";

export function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className={styles.container}>
      {steps.map((step, index) => {
        const completed = index < currentStep;
        const active = index === currentStep;

        return (
          <div
            key={step.id}
            className={styles.item}
          >
            <div className={styles.content}>
              <div
                className={[
                  styles.circle,
                  completed
                    ? styles.completedCircle
                    : active
                    ? styles.activeCircle
                    : styles.upcomingCircle,
                ].join(" ")}
              >
                {completed ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>

              <span className={styles.title}>
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={[
                  styles.line,
                  completed
                    ? styles.completedLine
                    : styles.upcomingLine,
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}