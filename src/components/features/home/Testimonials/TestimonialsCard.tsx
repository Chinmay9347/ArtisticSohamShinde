import { Star } from "lucide-react";

import { Testimonial } from "./Testimonials.types";
import { testimonialsStyles } from "./Testimonials.styles";

interface Props {
  testimonial: Testimonial;
}

export function TestimonialsCard({ testimonial }: Props) {
  return (
    <article className={testimonialsStyles.card}>
      <div className={testimonialsStyles.stars}>
        {Array.from({ length: testimonial.rating }).map((_, index) => (
          <Star
            key={index}
            size={20}
            fill="currentColor"
          />
        ))}
      </div>

      <p className={testimonialsStyles.review}>
        "{testimonial.review}"
      </p>

      <h3 className={testimonialsStyles.name}>
        {testimonial.name}
      </h3>

      <p className={testimonialsStyles.role}>
        {testimonial.role}
      </p>
    </article>
  );
}