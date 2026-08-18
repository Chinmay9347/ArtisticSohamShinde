import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { HeroImage } from "./Hero.image";
import { heroData } from "./Hero.data";
import { heroStyles } from "./Hero.styles";

export function Hero() {
  return (
    <Section>

      <Container>

        <div className={heroStyles.wrapper}>

          <div className={heroStyles.content}>

            <p className={heroStyles.badge}>
              {heroData.badge}
            </p>

            <h1 className={heroStyles.title}>
              {heroData.title}
            </h1>

            <p className={heroStyles.subtitle}>
              {heroData.subtitle}
            </p>

            <div className={heroStyles.buttons}>

              <Link href="/commission">
                <Button>
                  {heroData.primaryButton}
                </Button>
              </Link>

              <Link href="/gallery">
                <Button variant="outline">
                  {heroData.secondaryButton}
                </Button>
              </Link>

            </div>

          </div>

          <HeroImage />

        </div>

      </Container>

    </Section>
  );
}