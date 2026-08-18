import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { finalCTA } from "./FinalCTA.data";
import { finalCTAStyles } from "./FinalCTA.styles";

export function FinalCTA() {
  return (
    <Section>
      <Container>
        <div className={finalCTAStyles.section}>
          <p className={finalCTAStyles.eyebrow}>
            {finalCTA.eyebrow}
          </p>

          <h2 className={finalCTAStyles.title}>
            {finalCTA.title}
          </h2>

          <p className={finalCTAStyles.description}>
            {finalCTA.description}
          </p>

          <div className={finalCTAStyles.button}>
            <Link href={finalCTA.buttonHref}>
              <Button
                className="border-2 border-white hover:border-[#C9A227] hover:bg-black hover:text-white"
              >
                {finalCTA.buttonLabel}
              </Button>
              {/* <Button>
                {finalCTA.buttonLabel}
              </Button> */}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}