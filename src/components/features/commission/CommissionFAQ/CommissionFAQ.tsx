"use client";

import { useState } from "react";

import { commissionFAQs } from "@/data/commission";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { commissionFAQStyles as styles } from "./CommissionFAQ.styles";

export function CommissionFAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <h2 className={styles.heading}>
          Frequently Asked Questions
        </h2>

        <p className={styles.subtitle}>
          Everything you need to know before placing your custom portrait order.
        </p>

        <div className={styles.list}>
          {commissionFAQs.map((faq) => (
            <div
              key={faq.id}
              className={styles.item}
            >
              <button
                className={styles.question}
                onClick={() =>
                  setOpenId(openId === faq.id ? null : faq.id)
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
        </div>
      </Container>
    </Section>
  );
}