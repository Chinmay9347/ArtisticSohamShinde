"use client";

import { useEffect, useState } from "react";
import { Archive, Edit3, Eye, EyeOff, RotateCcw, Star } from "lucide-react";
import { ArtworkForm } from "@/components/features/admin/artworks/ArtworkForm";
import {
  archiveArtwork,
  getGallery,
  restoreArtwork,
  toggleArtworkFeatured,
  toggleArtworkAvailability,
  toggleArtworkVisible,
} from "@/services/gallery";
import type { GalleryDocument } from "@/services/gallery/gallery.types";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryDocument | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    try {
      setItems(await getGallery());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load gallery.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function run(action: () => Promise<unknown>, success: string) {
    try {
      setMessage("");
      await action();
      await load();
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gallery update failed.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Administration</p>
        <h1 className="mt-2 font-cinzel text-4xl">Gallery Management</h1>
        <p className="mt-3 max-w-3xl text-neutral-600">
          Gallery records come from Firestore and images are stored on Cloudinary. Create or edit artwork below.
        </p>
      </section>

      {message && <div className="rounded-2xl border bg-white p-4 text-sm">{message}</div>}

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <ArtworkForm
          mode={editing ? "edit" : "create"}
          artwork={editing ?? undefined}
          onSuccess={() => { setEditing(null); void load(); }}
          onCancel={() => setEditing(null)}
        />
      </section>

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Published & Managed Portraits</h2>
          <p className="mt-1 text-sm text-neutral-500">
            {items.length} Firestore gallery record{items.length === 1 ? "" : "s"}.
          </p>
        </div>

        {loading ? (
          <p className="p-8 text-neutral-500">Loading gallery from Firestore...</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-neutral-500">No gallery records found. Create one above or use Gallery Import.</p>
        ) : (
          <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const image = item.images[0] ?? item.image;
              const available = item.visible && item.status === "PUBLISHED" && item.availableForSale !== false;
              return (
                <article key={item.id} className="overflow-hidden rounded-2xl border bg-white">
                  {image?.secureUrl ? (
                    <img src={image.secureUrl} alt={image.alt ?? item.title} className="aspect-[4/5] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[4/5] items-center justify-center bg-neutral-100 text-sm text-neutral-500">No Cloudinary image</div>
                  )}
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-1 text-xs text-neutral-500">{item.categoryId ?? item.category ?? "Uncategorized"}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {available ? "Available" : "Not available"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setEditing(item)} className="rounded-xl border px-3 py-2 text-sm"><Edit3 size={15} className="mr-1 inline" />Edit</button>
                      <button onClick={() => void run(() => toggleArtworkFeatured(item.id, !item.featured), item.featured ? "Removed from featured." : "Marked as featured.")} className="rounded-xl border px-3 py-2 text-sm"><Star size={15} className="mr-1 inline" />{item.featured ? "Unfeature" : "Feature"}</button>
                      <button onClick={() => void run(() => toggleArtworkAvailability(item.id, item.availableForSale === false), item.availableForSale === false ? "Artwork made available." : "Artwork marked not available.")} className="rounded-xl border px-3 py-2 text-sm">{item.availableForSale === false ? "Make Available" : "Not Available"}</button>
                      <button onClick={() => void run(() => toggleArtworkVisible(item.id, !item.visible), item.visible ? "Artwork hidden." : "Artwork visible.")} className="rounded-xl border px-3 py-2 text-sm">{item.visible ? <Eye size={15} className="mr-1 inline" /> : <EyeOff size={15} className="mr-1 inline" />}{item.visible ? "Hide" : "Show"}</button>
                      {item.status === "ARCHIVED" ? (
                        <button onClick={() => void run(() => restoreArtwork(item.id), "Artwork restored.")} className="rounded-xl border px-3 py-2 text-sm"><RotateCcw size={15} className="mr-1 inline" />Restore</button>
                      ) : (
                        <button onClick={() => void run(() => archiveArtwork(item.id), "Artwork archived.")} className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600"><Archive size={15} className="mr-1 inline" />Archive</button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
