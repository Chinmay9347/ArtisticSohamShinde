//13/07/2026 0.1v
import {
  PricingCTA,
  PricingFAQ,
  PricingGrid,
  PricingHero,
} from "@/components/features/pricing";

export default function PricingPage() {
  return (
    <>
      <PricingHero
        title="Choose Your Perfect Portrait"
        subtitle="Every portrait is handcrafted with premium-quality materials and exceptional attention to detail. Select the size that best preserves your cherished memories."
      />

      <PricingGrid />

      <PricingFAQ />

      <PricingCTA
        title="Ready to Turn Your Memories into Timeless Art?"
        description="Whether it's a gift or a keepsake, every portrait is created with passion and precision to become a lasting memory for generations."
      />
    </>
  );
}

//13/07/2026 0.0v
// import {
//   PricingCTA,
//   PricingGrid,
//   PricingHero,
// } from "@/components/features/pricing";
// import { PricingFAQ } from "@/components/features/pricing";

// export default function PricingPage() {
//   return (
//     <>
//       <PricingHero
//         title="Choose Your Perfect Portrait"
//         subtitle="Every portrait is handcrafted with premium-quality materials and exceptional attention to detail. Select the size that best preserves your cherished memories."
//       />

//       <PricingGrid />
//       <PricingFAQ />
//       <PricingCTA
//         title="Ready to Turn Your Memories into Timeless Art?"
//         description="Whether it's a gift or a keepsake, every portrait is created with passion and precision to become a lasting memory for generations."
//       />
//     </>
//   );
// }

// import { Container } from "@/components/ui/Container";
// import { Heading } from "@/components/ui/Heading";
// import { Section } from "@/components/ui/Section";
// import { Typography } from "@/components/ui/Typography";

// export default function PricingPage() {
//   return (
//     <Section>
//       <Container>
//         <Heading level={1}>Pricing</Heading>

//         <Typography className="mt-6">
//           Portrait sizes, pricing and available options.
//         </Typography>
//       </Container>
//     </Section>
//   );
// }