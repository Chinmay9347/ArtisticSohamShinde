"use client";

import { ZoomIn, RotateCcw } from "lucide-react";

import { galleryLightboxStyles as styles } from "./GalleryLightboxV2.styles";

interface GalleryLightboxV2ToolbarProps {
  zoom: number;

  onZoomChange: (value: number) => void;

  onReset: () => void;
}

export function GalleryLightboxV2Toolbar({
  zoom,
  onZoomChange,
  onReset,
}: GalleryLightboxV2ToolbarProps) {
  return (
    <div className={styles.zoomToolbar}>
      <ZoomIn
        size={18}
        className={styles.zoomIcon}
      />

      <span className={styles.zoomMin}>
        100%
      </span>

      <input
        type="range"
        min={1}
        max={8}
        step={0.1}
        value={zoom}
        className={styles.zoomSlider}
        onChange={(e) =>
          onZoomChange(Number(e.target.value))
        }
      />

      <span className={styles.zoomMax}>
        800%
      </span>

      <span className={styles.zoomPercent}>
        {Math.round(zoom * 100)}%
      </span>

      <button
        onClick={onReset}
        className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white transition hover:border-[#C9A227] hover:text-[#C9A227]"
      >
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  );
}