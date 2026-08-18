import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

import { GalleryCard } from "./GalleryCard";
import { featuredGallery } from "./FeaturedGallery.data";
import { galleryStyles } from "./FeaturedGallery.styles";

export function FeaturedGallery() {
  return (
    <Section>
      <Container>

        <SectionHeader
          eyebrow="Featured Work"
          title="Portraits That Preserve Memories"
          description="Every portrait is handcrafted with care, precision, and attention to emotion."
          align="center"
        />

        <div className="mt-16">
         <div className={galleryStyles.grid}>
          {featuredGallery.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
        </div>

        <div className="mt-14 flex justify-center">
          <Link href="/gallery">
            <Button>
              View Complete Gallery
            </Button>
          </Link>
        </div>

      </Container>
    </Section>
  );
}