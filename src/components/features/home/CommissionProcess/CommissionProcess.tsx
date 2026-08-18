import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

import {
  processSteps,
  commissionProcessCTA,
} from "./CommissionProcess.data";
import { ProcessCard } from "./ProcessCard";
import { processStyles } from "./CommissionProcess.styles";

export function CommissionProcess() {
  return (
    <Section>
      <Container>

        <SectionHeader
          eyebrow="How It Works"
          title="From Your Favorite Photo to a Timeless Portrait"
          description="A simple and transparent process to turn your memories into handcrafted artwork."
          align="center"
        />

        <div className={processStyles.grid}>
          {processSteps.map((step) => (
            <ProcessCard
              key={step.id}
              step={step}
            />
          ))}
        </div>

        <div className={processStyles.button}>
          <Link href={commissionProcessCTA.href}>
            <Button>
              {commissionProcessCTA.label}
            </Button>
          </Link>
        </div>

      </Container>
    </Section>
  );
}