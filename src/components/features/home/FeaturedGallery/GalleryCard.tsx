import Image from "next/image";

import { GalleryItem } from "./FeaturedGallery.types";
import { galleryStyles } from "./FeaturedGallery.styles";

interface Props {
  item: GalleryItem;
}

export function GalleryCard({ item }: Props) {
  return (
    <article className={galleryStyles.card}>
      <div className={galleryStyles.image}>
        <Image
          src={item.image}
          alt={item.title}
          width={500}
          height={650}
          className={galleryStyles.imageElement}
        />
      </div>

      <div className={galleryStyles.content}>
        <h3 className={galleryStyles.title}>
          {item.title}
        </h3>

        <p className={galleryStyles.category}>
          {item.category}
        </p>
      </div>
    </article>
  );
}