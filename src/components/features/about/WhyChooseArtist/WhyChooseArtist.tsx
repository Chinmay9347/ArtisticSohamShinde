import {
  Heart,
  Package,
  Pencil,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { WhyChooseArtistProps } from "./WhyChooseArtist.types";
import { whyChooseArtistStyles as styles } from "./WhyChooseArtist.styles";

const icons = {
  Pencil,
  Sparkles,
  Package,
  Heart,
};

export function WhyChooseArtist({
  items,
}: WhyChooseArtistProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <h2 className={styles.heading}>
          Why Choose Artistic Soham
        </h2>

        <p className={styles.subtitle}>
          Every portrait is handcrafted with passion,
          precision, and premium materials to create
          artwork you'll cherish for years.
        </p>

        <div className={styles.grid}>
          {items.map((item) => {
            const Icon =
              icons[item.icon as keyof typeof icons];

            return (
              <div
                key={item.id}
                className={styles.card}
              >
                <div className={styles.icon}>
                  {Icon && <Icon size={32} />}
                </div>

                <h3 className={styles.title}>
                  {item.title}
                </h3>

                <p className={styles.description}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}