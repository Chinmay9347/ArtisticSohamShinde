"use client";

import { NavigationButtonsProps } from "./NavigationButtons.types";
import { toast } from "sonner";
import { navigationButtonsStyles as styles } from "./NavigationButtons.styles";

export function NavigationButtons({
  commission,
  submitLabel = "Place Order",
  loading = false,
  disabled = false,
  onSubmit,
}: NavigationButtonsProps) {
  const isFirstStep =
    commission.currentStep === 0;

  const isReviewStep =
    commission.steps[commission.currentStep]
      .id === "review";

  const isSuccessStep =
    commission.steps[commission.currentStep]
      .id === "success";

  const handleNext = () => {
    const { formData } = commission;
    const stepId = commission.steps[commission.currentStep].id;
    const errors: string[] = [];
    if (stepId === "customer") {
      if (!formData.customer.fullName.trim()) errors.push("Full name is required.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email.trim())) errors.push("A valid email address is required.");
      if (formData.customer.phone.replace(/\D/g, "").length < 10) errors.push("A valid phone number is required.");
      if (!formData.fulfillment.type) errors.push("Select a fulfillment method.");
      if (formData.fulfillment.type !== "digital") {
        if (!formData.delivery.addressLine1.trim()) errors.push("Delivery address is required.");
        if (!formData.delivery.city.trim()) errors.push("City is required.");
        if (!formData.delivery.state.trim()) errors.push("State is required.");
        if (!/^[0-9]{6}$/.test(formData.delivery.pincode.trim())) errors.push("Enter a valid 6-digit PIN code.");
      }
    }
    if (stepId === "portrait") {
      if (formData.portrait.subjects < 1 || formData.portrait.subjects > 4) errors.push("Subjects must be between 1 and 4.");
      if (!formData.portrait.size) errors.push("Portrait size is required.");
    }
    if (stepId === "instructions" && !formData.instructions.specialInstructions.trim() && !formData.instructions.giftMessage.trim()) {
      errors.push("Add at least one instruction or gift message so the artist knows your requirements.");
    }
    if (stepId === "review") { onSubmit?.(); return; }
    if (errors.length) { toast.error(errors[0]); return; }
    commission.nextStep();
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.previousButton}
        disabled={isFirstStep || loading}
        onClick={commission.previousStep}
      >
        Previous
      </button>

      {!isSuccessStep && (
        <button
          type="button"
          className={styles.nextButton}
          disabled={loading || disabled}
          onClick={handleNext}
        >
          {isReviewStep
            ? submitLabel
            : "Continue"}
        </button>
      )}
    </div>
  );
}