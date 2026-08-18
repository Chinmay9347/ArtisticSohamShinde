"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { Modal } from "../Modal";

import { GalleryLightboxProps } from "./GalleryLightboxV2.types";
import { galleryLightboxStyles as styles } from "./GalleryLightboxV2.styles";

import { GalleryLightboxV2Viewer } from "./GalleryLightboxV2Viewer";
import { GalleryLightboxV2Toolbar } from "./GalleryLightboxV2Toolbar";
import { GalleryLightboxV2Info } from "./GalleryLightboxV2Info";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

export default function GalleryLightboxV2({
  item,
  items,
  isOpen,
  onClose,
  onPrevious,
  onNext,
}: GalleryLightboxProps) {
  const transformRef =
    useRef<ReactZoomPanPinchRef | null>(null);

  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          onPrevious();
          break;

        case "ArrowRight":
          onNext();
          break;

        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onPrevious, onNext, onClose]);

  useEffect(() => {
    if (!item) return;

    // setZoom(1);

    setTimeout(() => {
      transformRef.current?.setTransform(0,0,1);
    }, 50);
  }, [item]);

  if (!item) return null;

  const currentIndex = items.findIndex(
    (galleryItem) => galleryItem.id === item.id
  );

  const handleZoomChange = (
    value: number
  ) => {
    setZoom(value);
    transformRef.current?.setTransform(0,0,value);
  };

  const handleReset = () => {
    setZoom(1);
    transformRef.current?.setTransform(0,0,1);
  };

  const primaryImage =
  item.images[0] ??
  item.image;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <GalleryLightboxV2Viewer
          image={primaryImage?.secureUrl ?? "/placeholder-image.jpg"}
          alt={primaryImage?.alt ?? item.title}
          currentIndex={currentIndex}
          totalImages={items.length}
          onPrevious={onPrevious}
          onNext={onNext}
          transformRef={transformRef}
        />

        <GalleryLightboxV2Toolbar
          zoom={zoom}
          onZoomChange={handleZoomChange}
          onReset={handleReset}
        />

        <GalleryLightboxV2Info
          title={item.title}
          description={item.description}
          category={item.category}
          medium={item.medium}
          dimensions={item.dimensions}
          year={item.year}
        />
      </div>
    </Modal>
  );
}