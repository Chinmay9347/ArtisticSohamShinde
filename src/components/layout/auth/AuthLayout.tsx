"use client";

import Image from "next/image";

import { SITE_ASSETS } from "@/constants/site-assets";

import { AuthLayoutProps } from "./AuthLayout.types";
import { authLayoutStyles as styles } from "./AuthLayout.styles";

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.left}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              Artistic Soham
            </div>

            <p className={styles.tagline}>
              Turning Memories into Timeless Art.
            </p>
          </div>

          <div className={styles.artwork}>
            <Image
              src={SITE_ASSETS.galleryPortrait01}
              alt="Artwork"
              width={600}
              height={800}
              className={styles.artworkImage}
              priority
            />
          </div>
        </section>

        <section className={styles.right}>
          <div className={styles.formWrapper}>
            <h1 className={styles.title}>
              {title}
            </h1>

            <p className={styles.subtitle}>
              {subtitle}
            </p>

            <div className={styles.content}>
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}