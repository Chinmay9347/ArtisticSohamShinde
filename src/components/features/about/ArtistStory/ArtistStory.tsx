import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { SITE_ASSETS } from "@/constants/site-assets";
import { Section } from "@/components/ui/Section";

import { ArtistStoryProps } from "./ArtistStory.types";
import { artistStoryStyles as styles } from "./ArtistStory.styles";

export function ArtistStory({
  artist,
}: ArtistStoryProps) {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src={SITE_ASSETS.artistPortrait}
            alt={artist.name}
            width={700}
            height={900}
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <h2 className={styles.heading}>
            Meet {artist.name}
          </h2>

          <p className={styles.role}>
            {artist.title}
          </p>

          <p className={styles.location}>
            {artist.location}
          </p>

          {artist.description.map((paragraph, index) => (
            <p
              key={index}
              className={styles.paragraph}
            >
              {paragraph}
            </p>
          ))}

          <p className={styles.signature}>
            {artist.signature}
          </p>
        </div>
      </Container>
    </Section>
  );
}