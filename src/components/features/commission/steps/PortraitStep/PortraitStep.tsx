"use client";

import { NavigationButtons } from "../../NavigationButtons";
import { ProgressBar } from "../../ProgressBar";
import { StepHeader } from "../../StepHeader";

import { portraitStepStyles as styles } from "./PortraitStep.styles";
import type { PortraitStepProps } from "./PortraitStep.types";
import { getCommissionPackage } from "@/data/commissionPackages";

export function PortraitStep({
  commission, fromGallery=false,
}: PortraitStepProps) {
  const { portrait } = commission.formData;

  const selectedPackage = getCommissionPackage(
    commission.formData.package
  );

  const updatePortrait = <
    K extends keyof typeof portrait
  >(
    field: K,
    value: (typeof portrait)[K]
  ) => {
    commission.updateFormData({
      portrait: {
        ...portrait,
        [field]: value,
      },
    });
  };

  return (
    <section className={styles.container}>
      <ProgressBar commission={commission} />

      <StepHeader
        currentStep={commission.currentStep + 1}
        totalSteps={commission.steps.length}
        title="Portrait Preferences"
        description="Customize your portrait by selecting the number of subjects, orientation, and framing options."
      />

      <div className={styles.form}>
        {/* <div className={styles.field}>
          <label className={styles.label}>
            Number of Subjects
          </label>

          <input
            type="number"
            min={1}
            max={10}
            className={styles.input}
            value={portrait.subjects}
            onChange={(e) =>
              updatePortrait(
                "subjects",
                Number(e.target.value)
              )
            }
          />
        </div> */}
        <div className={styles.field}>
          <label className={styles.label}>
            Number of Subjects
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={portrait.subjects <= 1}
              onClick={() =>
                updatePortrait(
                  "subjects",
                  Math.max(1, portrait.subjects - 1)
                )
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-300 bg-black text-xl font-semibold text-white transition hover:border-amber-400 hover:bg-amber-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Decrease number of subjects"
            >
              −
            </button>

            <div
              className="flex h-11 min-w-16 items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 text-lg font-semibold"
              aria-live="polite"
            >
              {portrait.subjects}
            </div>

            <button
              type="button"
              disabled={portrait.subjects >= 4}
              onClick={() =>
                updatePortrait(
                  "subjects",
                  Math.min(4, portrait.subjects + 1)
                )
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-300 bg-black text-xl font-semibold text-white transition hover:border-amber-400 hover:bg-amber-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Increase number of subjects"
            >
              +
            </button>
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            You can include 1 to 4 subjects in one portrait.
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Portrait Size *</label>
          <select
            className={styles.select}
            disabled
            value={portrait.size}
            onChange={(e) => updatePortrait("size", e.target.value as typeof portrait.size)}
          >
            {(["A5", "A4", "A3", "A2"] as const).map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <p className="mt-2 text-sm text-neutral-500">Portrait size is locked to the selected package. Choose a different package on the Package step to change the size.</p>
        </div>

        <div className={styles.fullWidth}>
          <label className={styles.label}>
            Orientation
          </label>

          <div className={styles.radioGroup}>
            {[
              "portrait",
              "landscape",
              "square",
            ].map((orientation) => (
              <button
                key={orientation}
                type="button"
                className={
                  portrait.orientation === orientation
                    ? styles.radioButtonActive
                    : styles.radioButton
                }
                onClick={() =>
                  updatePortrait(
                    "orientation",
                    orientation as
                      | "portrait"
                      | "landscape"
                      | "square"
                  )
                }
              >
                {orientation.charAt(0).toUpperCase() +
                  orientation.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.fullWidth}>
          <label
            className={
              styles.checkboxWrapper
            }
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={portrait.framing}
              disabled={
                commission.formData.fulfillment.type ===
                "digital"
              }
              onChange={(e) =>
                updatePortrait(
                  "framing",
                  e.target.checked
                )
              }
            />

            <span>
              Include Premium Frame
              {commission.formData.fulfillment.type ===
                "digital" && (
                <span className="ml-2 text-sm text-neutral-400">
                  Not available for Digital Download
                </span>
              )}
            </span>
          </label>
        </div>
      </div>

      <NavigationButtons
        commission={commission}
      />
    </section>
  );
}