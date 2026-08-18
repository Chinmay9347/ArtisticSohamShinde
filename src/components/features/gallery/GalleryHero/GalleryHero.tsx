import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { galleryHeroData } from "./GalleryHero.data";
import { galleryHeroStyles } from "./GalleryHero.styles";

export function GalleryHero() {
  return (
    <Section className={galleryHeroStyles.wrapper}>
      <Container>
        <div className={galleryHeroStyles.content}>

          <p className={galleryHeroStyles.eyebrow}>
            {galleryHeroData.eyebrow}
          </p>

          <h1 className={galleryHeroStyles.title}>
            {galleryHeroData.title}
          </h1>

          <p className={galleryHeroStyles.description}>
            {galleryHeroData.description}
          </p>

        </div>
      </Container>
    </Section>
  );
}