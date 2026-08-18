"use client";

import { useState } from "react";

import { contactFAQs } from "@/data/contact";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { contactFAQStyles as styles } from "./ContactFAQ.styles";

export function ContactFAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <h2 className={styles.heading}>
          Frequently Asked Questions
        </h2>

        <p className={styles.subtitle}>
          Find quick answers before contacting us.
        </p>

        <div className={styles.list}>
          {contactFAQs.map((faq) => (
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