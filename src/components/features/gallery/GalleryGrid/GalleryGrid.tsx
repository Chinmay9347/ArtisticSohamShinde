//12/07/2026  0.0v
"use client";

import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { GalleryGridCard } from "./GalleryGridCard";
import GalleryLightboxV2 from "../GalleryLightboxV2/GalleryLightboxV2";
// import GalleryLightboxV2 from "../GalleryLightboxV2";

import { galleryGridStyles } from "./GalleryGrid.styles";
import type { GalleryDocument } from "@/services/gallery/gallery.types";

interface Props {
  items: GalleryDocument[];
  onClick?: () => void;
}

export function GalleryGrid({ items }: Props) {
  const [selectedImage, setSelectedImage] = useState<GalleryDocument | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleImageClick = (item: GalleryDocument) => {
    setSelectedImage(item);
    setIsLightboxOpen(true);
  };

  const handleClose = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  const handlePrevious = () => {
  if (!selectedImage) return;

  const currentIndex = items.findIndex(
    (galleryItem) => galleryItem.id === selectedImage.id
  );

  const previousIndex =
    currentIndex === 0 ? items.length - 1 : currentIndex - 1;

  setSelectedImage(items[previousIndex]);
};

const handleNext = () => {
  if (!selectedImage) return;

  const currentIndex = items.findIndex(
    (galleryItem) => galleryItem.id === selectedImage.id
  );

  const nextIndex =
    currentIndex === items.length - 1 ? 0 : currentIndex + 1;

  setSelectedImage(items[nextIndex]);
};

  return (
    <Section>
      <Container>
        <div className={galleryGridStyles.grid}>
          {items.map((item) => (
            <GalleryGridCard
              key={item.id}
              item={item}
              onClick={() => handleImageClick(item)}
            />
          ))}
        </div>

        <GalleryLightboxV2
          item={selectedImage}
          isOpen={isLightboxOpen}
          onClose={handleClose}
          onPrevious={handlePrevious}
          onNext={handleNext}
          items={items}
        />
      </Container>
    </Section>
  );
}

// export function GalleryGrid() {
//   return <div>Gallery Grid</div>;
// }
// import { galleryItems } from "@/data/gallery";

// import { Container } from "@/components/ui/Container";
// import { Section } from "@/components/ui/Section";

// import { GalleryGridCard } from "./GalleryGridCard";
// import { galleryGridStyles } from "./GalleryGrid.styles";
// import { GalleryItem } from "@/types/gallery";

// interface Props {
//   items: GalleryItem[];
// }

// export function GalleryGrid({ items }: Props) {
//   return (
//     <Section>
//       <Container>

//         <div className={galleryGridStyles.grid}>
//           {items.map((item) => (
//             <GalleryGridCard
//               key={item.id}
//               item={item}
//             />
//           ))}
//         </div>

//       </Container>
//     </Section>
//   );
// }
