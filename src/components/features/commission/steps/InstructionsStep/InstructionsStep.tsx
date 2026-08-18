"use client";

import { NavigationButtons } from "../../NavigationButtons";
import { ProgressBar } from "../../ProgressBar";
import { StepHeader } from "../../StepHeader";

import { instructionsStepStyles as styles } from "./InstructionsStep.styles";
import type { InstructionsStepProps } from "./InstructionsStep.types";

const suggestions = [
  "Remove Background",
  "Combine Photos",
  "Black & White",
  "Add Person",
  "Remove Person",
  "Improve Quality",
];

export function InstructionsStep({
  commission,
}: InstructionsStepProps) {
  const { instructions } =
    commission.formData;

  const updateField = (
    field: keyof typeof instructions,
    value: string
  ) => {
    commission.updateFormData({
      instructions: {
        ...instructions,
        [field]: value,
      },
    });
  };

  const addSuggestion = (
    suggestion: string
  ) => {
    const current =
      instructions.specialInstructions.trim();

    updateField(
      "specialInstructions",
      current
        ? `${current}\n• ${suggestion}`
        : `• ${suggestion}`
    );
  };

  return (
    <section className={styles.container}>
      <ProgressBar
        commission={commission}
      />

      <StepHeader
        currentStep={
          commission.currentStep + 1
        }
        totalSteps={
          commission.steps.length
        }
        title="Special Instructions"
        description="Tell us about any custom requests, editing preferences, or gift message for your portrait."
      />

      <div className={styles.form}>
        {/* <div className={styles.field}>
          <label className={styles.label}>
            Special Instructions
          </label>

          <div className={styles.suggestionBox}> */}
        <div className={styles.field}>
          <label className={styles.label}>
            Special Instructions
          </label>

          <div className={styles.suggestionBox}>
            <p className={styles.suggestionTitle}>
              Common Requests
            </p>

            {/* <div className={styles.suggestionGrid}>
              <p className={styles.suggestionTitle}>
                Common Requests
              </p> */}

              <div className={styles.suggestionGrid}>
                {suggestions.map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className={
                        styles.suggestionChip
                      }
                      onClick={() =>
                        addSuggestion(
                          suggestion
                        )
                      }
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            {/* </div> */}
          </div>

          <textarea
            className={styles.textarea}
            placeholder="Example: Remove the background, improve image quality, combine two reference photos, etc."
            value={
              instructions.specialInstructions
            }
            onChange={(e) =>
              updateField(
                "specialInstructions",
                e.target.value
              )
            }
          />

          <p className={styles.helper}>
            Mention any artwork preferences,
            background changes, edits, colors,
            or specific requests.
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Gift Message (Optional)
          </label>

          <textarea
            className={styles.textarea}
            placeholder="Write a personal message if this portrait is a gift."
            value={
              instructions.giftMessage
            }
            onChange={(e) =>
              updateField(
                "giftMessage",
                e.target.value
              )
            }
          />

          <p className={styles.helper}>
            We'll include this message with
            your portrait if requested.
          </p>
        </div>
      </div>

      <NavigationButtons
        commission={commission}
      />
    </section>
  );
}

//02/08/2026
// "use client";

// import { NavigationButtons } from "../../NavigationButtons";
// import { ProgressBar } from "../../ProgressBar";
// import { StepHeader } from "../../StepHeader";

// import { instructionsStepStyles as styles } from "./InstructionsStep.styles";
// import type { InstructionsStepProps } from "./InstructionsStep.types";

// export function InstructionsStep({
//   commission,
// }: InstructionsStepProps) {
//   const { instructions } =
//     commission.formData;

//   const updateField = (
//     field: keyof typeof instructions,
//     value: string
//   ) => {
//     commission.updateFormData({
//       instructions: {
//         ...instructions,
//         [field]: value,
//       },
//     });
//   };

//   return (
//     <section className={styles.container}>
//       <ProgressBar
//         commission={commission}
//       />

//       <StepHeader
//         currentStep={commission.currentStep + 1}
//         totalSteps={commission.steps.length}
//         title="Special Instructions"
//         description="Tell us about any custom requests, editing preferences, or gift message for your portrait."
//       />

//       <div className={styles.form}>
//         <div className={styles.field}>
//           <label className={styles.label}>
//             Special Instructions
//           </label>

//           <div className={styles.form}>

//             <div className={styles.suggestionBox}>
//               <p className={styles.suggestionTitle}>
//                 Common Requests
//               </p>

//               <div className={styles.suggestionGrid}>
//                 {[
//                   "Remove Background",
//                   "Combine Photos",
//                   "Black & White",
//                   "Add Person",
//                   "Remove Person",
//                   "Improve Quality",
//                 ].map((suggestion) => (
//                   <button
//                     key={suggestion}
//                     type="button"
//                     className={styles.suggestionChip}
//                     onClick={() =>
//                       updateField(
//                         "specialInstructions",
//                         instructions.specialInstructions
//                           ? `${instructions.specialInstructions}\n• ${suggestion}`
//                           : `• ${suggestion}`
//                       )
//                     }
//                   >
//                     {suggestion}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className={styles.field}>
//               <label className={styles.label}>
//                 Special Instructions
//               </label>

//               <textarea
//                 className={styles.textarea}
//                 placeholder="Example: Remove the background, improve image quality, combine two reference photos, etc."
//                 value={instructions.specialInstructions}
//                 onChange={(e) =>
//                   updateField(
//                     "specialInstructions",
//                     e.target.value
//                   )
//                 }
//               />

//               <p className={styles.helper}>
//                 Mention any artwork preferences,
//                 background changes, edits, colors,
//                 or specific requests.
//               </p>
//             </div>

//             {/* Gift Message field continues here */}

//           </div>

//           <textarea
//             className={styles.textarea}
//             placeholder="Example: Remove the background, improve image quality, combine two reference photos, etc."
//             value={
//               instructions.specialInstructions
//             }
//             onChange={(e) =>
//               updateField(
//                 "specialInstructions",
//                 e.target.value
//               )
//             }
//           />

//           <p className={styles.helper}>
//             Mention any artwork preferences,
//             background changes, edits, colors,
//             or specific requests.
//           </p>
//         </div>

//         <div className={styles.field}>
//           <label className={styles.label}>
//             Gift Message (Optional)
//           </label>

//           <textarea
//             className={styles.textarea}
//             placeholder="Write a personal message if this portrait is a gift."
//             value={
//               instructions.giftMessage
//             }
//             onChange={(e) =>
//               updateField(
//                 "giftMessage",
//                 e.target.value
//               )
//             }
//           />

//           <p className={styles.helper}>
//             We'll include this message with
//             your portrait if requested.
//           </p>
//         </div>
//       </div>

//       <NavigationButtons
//         commission={commission}
//       />
//     </section>
//   );
// }