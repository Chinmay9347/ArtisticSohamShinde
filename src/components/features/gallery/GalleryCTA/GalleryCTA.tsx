// export function GalleryCTA() {
//   return <div>Gallery CTA</div>;
// }
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { galleryCTA } from "./GalleryCTA.data";
import { galleryCTAStyles } from "./GalleryCTA.styles";

export function GalleryCTA() {
  return (
    <Section>
      <Container>
        <div className={galleryCTAStyles.section}>
          <p className={galleryCTAStyles.eyebrow}>
            {galleryCTA.eyebrow}
          </p>

          <h2 className={galleryCTAStyles.title}>
            {galleryCTA.title}
          </h2>

          <p className={galleryCTAStyles.description}>
            {galleryCTA.description}
          </p>

          <div className={galleryCTAStyles.button}>
            <Link href={galleryCTA.buttonHref}>
              <Button className="border-2 border-white hover:border-[#C9A227] hover:bg-black hover:text-white hover:shadow-[0_0_25px_rgba(201,162,39,0.35)]">
                {galleryCTA.buttonLabel}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}