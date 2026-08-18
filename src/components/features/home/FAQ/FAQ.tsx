import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

import { faqs } from "./FAQ.data";
import { FAQCard } from "./FAQCard";
import { faqStyles } from "./FAQ.styles";

export function FAQ() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Frequently Asked Questions"
          title="Everything You Need to Know"
          description="Here are answers to some common questions about custom portrait commissions."
          align="center"
        />

        <div className={faqStyles.wrapper}>
          {faqs.map((faq) => (
            <FAQCard
              key={faq.id}
              faq={faq}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}