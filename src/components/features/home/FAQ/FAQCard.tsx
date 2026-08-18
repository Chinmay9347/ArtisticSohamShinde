"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { FAQ } from "./FAQ.types";
import { faqStyles } from "./FAQ.styles";

interface Props {
  faq: FAQ;
}

export function FAQCard({ faq }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <article className={faqStyles.item}>
      <button
        onClick={() => setOpen(!open)}
        className={faqStyles.button}
      >
        <span className={faqStyles.question}>
          {faq.question}
        </span>

        <ChevronDown
          className={`${faqStyles.icon} transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <p className={faqStyles.answer}>
          {faq.answer}
        </p>
      )}
    </article>
  );
}