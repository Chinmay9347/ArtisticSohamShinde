import {
  GalleryImportProgress,
  GalleryImportResult,
} from "@/services/gallery/gallery-import.types";

export type GalleryImporterProps = Record<string, never>;

export type ImportLog = GalleryImportResult;

export interface GalleryImporterState {
  importing: boolean;
  progress: GalleryImportProgress;
  logs: ImportLog[];
}