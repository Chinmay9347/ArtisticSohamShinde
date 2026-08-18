import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

import { testimonials } from "./Testimonials.data";
import { TestimonialsCard } from "./TestimonialsCard";
import { testimonialsStyles } from "./Testimonials.styles";

export function Testimonials() {
  if (testimonials.length < 3) return null;
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Testimonials"
          title="What Future Customers Will Say"
          description="This section will showcase genuine reviews from customers who commissioned custom pencil portraits."
          align="center"
        />

        <div className={testimonialsStyles.grid}>
          {testimonials.map((testimonial) => (
            <TestimonialsCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}