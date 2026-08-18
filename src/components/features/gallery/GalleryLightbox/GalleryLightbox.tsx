"use client";

import { useEffect, useRef  } from "react";
//import Image from "next/image";
import {
  TransformWrapper,
  // TransformComponent,
} from "react-zoom-pan-pinch";
import { ZoomIn } from "lucide-react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import {Modal} from "../Modal";

import { GalleryLightboxProps } from "./GalleryLightbox.types";
import { galleryLightboxStyles as styles } from "./GalleryLightbox.styles";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

export default function GalleryLightbox({
  item,
  // items,
  isOpen,
  onClose,
  onPrevious,
  onNext,
}: GalleryLightboxProps) {
      // const [isZoomed, setIsZoomed] = useState(false);
      // useEffect(() => {
      //   setIsZoomed(false);
      // }, [item]);
      const transformRef =
        useRef<ReactZoomPanPinchRef | null>(null);;

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
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, onPrevious, onNext, onClose]);
      if (!item) return null;

    // const currentIndex = items.findIndex(
    //   (galleryItem) => galleryItem.id === item.id
    // );

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

        <div className={styles.imageWrapper}>
          <button
            onClick={onPrevious}
            className={`${styles.navButton} ${styles.leftButton}`}
            aria-label="Previous Image"
          >
            <ChevronLeft size={28} />
          </button>

          <TransformWrapper
            ref={transformRef}
            initialScale={1}
            minScale={1}
            maxScale={8}
            wheel={{ step: 0.2 }}
            doubleClick={{ mode: "zoomIn" }}
            centerOnInit
          >
            {/* {({ state, setTransform }) => (
              <>
                <TransformComponent
                  wrapperClass="w-full h-full"
                  contentClass="flex items-center justify-center"
                  //contentClass="flex h-full w-full items-center justify-center"
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    className={styles.image}
                    draggable={false}
                  />
                </TransformComponent>

                <div className={styles.counter}>
                  {currentIndex + 1} / {items.length}
                </div>

              </>
            )} */}
          </TransformWrapper>
          

          <button
            onClick={onNext}
            className={`${styles.navButton} ${styles.rightButton}`}
            aria-label="Next Image"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        <div className={styles.zoomToolbar}>
          <ZoomIn size={18} className={styles.zoomIcon} />

          <span className={styles.zoomMin}>100%</span>

          <input
            type="range"
            min={1}
            max={8}
            step={0.1}
            defaultValue={1}
            className={styles.zoomSlider}
            onChange={(e) => {
              const scale = Number(e.target.value);

              transformRef.current?.setTransform(0,0,scale);
            }}
          />

          <span className={styles.zoomMax}>800%</span>

          <span className={styles.zoomPercent}>100%</span>
        </div>

        <div className={styles.info}>
          <h2 className={styles.title}>
            {item.title}
          </h2>

          {item.description && (
            <p className={styles.description}>
              {item.description}
            </p>
          )}

          <div className={styles.meta}>
            <span>Category: {item.category}</span>

            {item.medium && (
              <span>Medium: {item.medium}</span>
            )}

            {item.dimensions && (
              <span>Size: {item.dimensions}</span>
            )}

            {item.year && (
              <span>Year: {item.year}</span>
            )}
          </div>
          
        </div>
      </div>
    </Modal>
  );
}