"use client";

import { useMemo } from "react";
import { StepHeader } from "../../StepHeader";

import { successStepStyles as styles } from "./SuccessStep.styles";
import type { SuccessStepProps } from "./SuccessStep.types";

export function SuccessStep({
  commission,
}: SuccessStepProps) {
  const orderId = useMemo(() => {
    return `AS-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
  }, []);

  return (
    <section className={styles.container}>
      <StepHeader
        currentStep={commission.currentStep + 1}
        totalSteps={commission.steps.length}
        title="Order Submitted Successfully"
        description="Thank you for choosing Artistic Soham."
      />

      <div className={styles.card}>
        <div className={styles.icon}>
          ✅
        </div>

        <h2 className={styles.title}>
          Your Commission Request Has Been Received
        </h2>

        <p className={styles.subtitle}>
          We've successfully received your commission request.
          Our team will review your submitted details and
          contact you shortly.
        </p>

        <div className={styles.orderCard}>
          <p className={styles.orderLabel}>
            Reference ID
          </p>

          <p className={styles.orderId}>
            {orderId}
          </p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.bullet} />
            <div>
              <strong>Order Review</strong>
              <p>Your photos and requirements will be reviewed.</p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.bullet} />
            <div>
              <strong>Confirmation</strong>
              <p>We'll contact you to confirm the commission details.</p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.bullet} />
            <div>
              <strong>Artwork Creation</strong>
              <p>Your portrait will be handcrafted with care.</p>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.bullet} />
            <div>
              <strong>Delivery</strong>
              <p>Your completed artwork will be securely delivered.</p>
            </div>
          </div>
        </div>

        <div className={styles.actionContainer}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => commission.resetForm()}
          >
            Place Another Order
          </button>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    </section>
  );
}