"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

import { importGallery } from "@/services/gallery/gallery-import.service";

import {
  GalleryImportProgress,
} from "@/services/gallery/gallery-import.types";

import {
  GalleryImporterState,
} from "./GalleryImporter.types";

import { styles } from "./GalleryImporter.styles";

const initialProgress: GalleryImportProgress = {
  total: 0,
  current: 0,
  uploaded: 0,
  skipped: 0,
  failed: 0,
};

export function GalleryImporter() {
  const [state, setState] =
    useState<GalleryImporterState>({
      importing: false,
      progress: initialProgress,
      logs: [],
    });

  async function handleImport() {
    setState({
      importing: true,
      progress: initialProgress,
      logs: [],
    });

    await importGallery({
      onProgress(progress) {
        setState((prev) => ({
          ...prev,
          progress,
        }));
      },

      onItemComplete(result) {
        setState((prev) => ({
          ...prev,
          logs: [...prev.logs, result],
        }));
      },
    });

    setState((prev) => ({
      ...prev,
      importing: false,
    }));
  }

  const percentage =
    state.progress.total === 0
      ? 0
      : (state.progress.current /
          state.progress.total) *
        100;

  return (
    <section className={styles.container}>

      <h1 className={styles.title}>
        Gallery Import Tool
      </h1>

      <p className={styles.subtitle}>
        Upload all gallery artworks to
        Cloudinary and Firestore.
      </p>

      <Button
        className={styles.button}
        disabled={state.importing}
        onClick={handleImport}
      >
        {state.importing
          ? "Importing..."
          : "Start Import"}
      </Button>

      <div className={styles.progress}>
        <div>
          {state.progress.current} /{" "}
          {state.progress.total}
        </div>

        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>
            Uploaded
          </div>

          <div className={styles.statValue}>
            {state.progress.uploaded}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>
            Skipped
          </div>

          <div className={styles.statValue}>
            {state.progress.skipped}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>
            Failed
          </div>

          <div className={styles.statValue}>
            {state.progress.failed}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>
            Total
          </div>

          <div className={styles.statValue}>
            {state.progress.total}
          </div>
        </div>
      </div>

      <div className={styles.logs}>
        {state.logs.map((log) => (
          <div
            key={`${log.artwork.id}-${log.message}`}
            className={styles.log}
          >
            <span>
              {log.artwork.title}
            </span>

            <span
              className={
                log.success
                  ? styles.success
                  : styles.failed
              }
            >
              {log.message}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}