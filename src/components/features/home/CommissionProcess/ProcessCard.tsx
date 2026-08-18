//12/07/2026 0.0v
import {
  ImagePlus,
  MessageCircleMore,
  PencilLine,
  PackageCheck,
} from "lucide-react";

import { ProcessStep } from "./CommissionProcess.types";
import { processStyles } from "./CommissionProcess.styles";

interface Props {
  step: ProcessStep;
}

const icons = {
  "01": <ImagePlus className="h-10 w-10 text-[#C9A227]" />,
  "02": <MessageCircleMore className="h-10 w-10 text-[#C9A227]" />,
  "03": <PencilLine className="h-10 w-10 text-[#C9A227]" />,
  "04": <PackageCheck className="h-10 w-10 text-[#C9A227]" />,
};

export function ProcessCard({ step }: Props) {
  return (
    <article className={processStyles.card}>
      <div className="mb-6">
        {icons[step.step as keyof typeof icons]}
      </div>

      <h3 className={processStyles.title}>
        {step.title}
      </h3>

      <p className={processStyles.description}>
        {step.description}
      </p>
    </article>
  );
}


// import { ProcessStep } from "./CommissionProcess.types";
// import { processStyles } from "./CommissionProcess.styles";

// interface Props {
//   step: ProcessStep;
// }

// export function ProcessCard({ step }: Props) {
//   return (
//     <article className={processStyles.card}>
//       <p className={processStyles.number}>
//         {step.step}
//       </p>

//       <h3 className={processStyles.title}>
//         {step.title}
//       </h3>

//       <p className={processStyles.description}>
//         {step.description}
//       </p>
//     </article>
//   );
// }