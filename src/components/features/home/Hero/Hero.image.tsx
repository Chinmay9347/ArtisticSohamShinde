//12/07/2026 0.0v
import Image from "next/image";

import { SITE_ASSETS } from "@/constants/site-assets";

export function HeroImage() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:mt-8">
      <div className="absolute inset-0 -z-10 rounded-[40px] bg-[#F8F8F8]" />

      <Image
        src={SITE_ASSETS.heroPlaceholder}
        alt="Featured Portrait"
        width={500}
        height={650}
        priority
        className="h-auto w-full rounded-3xl object-cover shadow-2xl"
      />
    </div>
  );
}

// import Image from "next/image";

// export function HeroImage() {
//   return (
//     <div className="relative w-full max-w-md">//"relative flex items-center justify-center lg:mt-8">
//       <div className="absolute h-[520px] w-[420px] rounded-[40px] bg-[#F8F8F8]" />

//       <Image
//         alt="Featured Portrait"
//         width={500}
//         height={650}
//         className="h-auto w-full rounded-3xl object-cover shadow-2xl"//"relative rounded-3xl object-cover shadow-2xl"
//         priority
//       />

//     </div>
//   );
// }