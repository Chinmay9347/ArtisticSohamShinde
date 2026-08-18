"use client";

import { galleryLightboxStyles as styles } from "./GalleryLightboxV2.styles";

interface GalleryLightboxV2InfoProps {
  title: string;
  description?: string;
  category: string;
  medium?: string;
  dimensions?: string;
  year?: string | number;
}

export function GalleryLightboxV2Info({
  title,
  description,
  category,
  medium,
  dimensions,
  year,
}: GalleryLightboxV2InfoProps) {
  return (
    <div className={styles.info}>
      <h2 className={styles.title}>
        {title}
      </h2>

      {description && (
        <p className={styles.description}>
          {description}
        </p>
      )}

      <div className={styles.meta}>
        <div>
          <span className="font-semibold text-white">
            Category
          </span>

          <p>{category}</p>
        </div>

        {medium && (
          <div>
            <span className="font-semibold text-white">
              Medium
            </span>

            <p>{medium}</p>
          </div>
        )}

        {dimensions && (
          <div>
            <span className="font-semibold text-white">
              Size
            </span>

            <p>{dimensions}</p>
          </div>
        )}

        {year && (
          <div>
            <span className="font-semibold text-white">
              Year
            </span>

            <p>{year}</p>
          </div>
        )}
      </div>
    </div>
  );
}