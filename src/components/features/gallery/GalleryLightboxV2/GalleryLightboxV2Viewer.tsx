"use client";

import { useEffect, useState } from "react";
import {
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { galleryLightboxStyles as styles } from "./GalleryLightboxV2.styles";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

interface GalleryLightboxV2ViewerProps {
  image: string;
  alt: string;

  currentIndex: number;

  totalImages: number;

  onPrevious: () => void;

  onNext: () => void;

  transformRef: React.RefObject<ReactZoomPanPinchRef | null>;

  children?: React.ReactNode;
}

export function GalleryLightboxV2Viewer({
  image,
  alt,
  currentIndex,
  totalImages,
  onPrevious,
  onNext,
  transformRef,
  children,
}: GalleryLightboxV2ViewerProps) {
  const [orientation, setOrientation] = useState<
    "portrait" | "landscape" | "square"
  >("portrait");

  useEffect(() => {
    const img = new Image();

    img.src = image;

    img.onload = () => {
      if (img.width > img.height) {
        setOrientation("landscape");
      } else if (img.height > img.width) {
        setOrientation("portrait");
      } else {
        setOrientation("square");
      }
    };
  }, [image]);
  return (
    <div className={styles.viewer}>
      <button
        onClick={onPrevious}
        className={`${styles.navButton} ${styles.leftButton}`}
      >
        <ChevronLeft size={30} />
      </button>

      <div className={styles.imageWrapper}>
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={1}
          maxScale={8}
          centerOnInit
          wheel={{ step: 0.2 }}
          doubleClick={{ mode: "zoomIn" }}

          limitToBounds={false}
          centerZoomedOut
          panning={{ disabled: false }}
        >
          <TransformComponent
            wrapperClass="w-full h-full"
            contentClass="flex h-full w-full items-center justify-center"
          >
            <img
              src={image}
              alt={alt}
              draggable={false}
              className={`${styles.image} ${
                orientation === "portrait"
                  ? styles.portraitImage
                  : orientation === "landscape"
                  ? styles.landscapeImage
                  : styles.squareImage
              }`}
            />
          </TransformComponent>

          {children}
        </TransformWrapper>
      </div>

      <button
        onClick={onNext}
        className={`${styles.navButton} ${styles.rightButton}`}
      >
        <ChevronRight size={30} />
      </button>

      <div className={styles.counter}>
        {currentIndex + 1} / {totalImages}
      </div>
    </div>
  );
}