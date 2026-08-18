"use client";

import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { pricingFAQs } from "@/data/pricing";
import { pricingFAQStyles as styles } from "./PricingFAQ.styles";

export function PricingFAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <h2 className={styles.heading}>
          Frequently Asked Questions
        </h2>

        {pricingFAQs.map((faq) => (
          <div
            key={faq.id}
            className={styles.item}
          >
            <button
              className={styles.question}
              onClick={() =>
                setOpenId(
                  openId === faq.id ? null : faq.id
                )
              }
            >
              {faq.question}
            </button>

            {openId === faq.id && (
              <div className={styles.answer}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </Container>
    </Section>
  );
}