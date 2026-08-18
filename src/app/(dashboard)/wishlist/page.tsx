"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getGallery } from "@/services/gallery";
import type { GalleryDocument } from "@/services/gallery/gallery.types";
import { getWishlistIds, removeFromWishlist } from "@/services/wishlist";

export default function WishlistPage() {
  const [items, setItems] = useState<GalleryDocument[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const ids = getWishlistIds();
      const gallery = await getGallery();
      setItems(gallery.filter((item) => ids.includes(item.id)));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  if (loading) return <section className="rounded-3xl border bg-white p-8">Loading wishlist...</section>;

  return (
    <main className="space-y-8">
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Saved Portraits</p>
        <h1 className="mt-2 font-cinzel text-4xl font-bold">Wishlist</h1>
        <p className="mt-3 text-neutral-600">Save portraits from the gallery and check whether they are currently available for commission.</p>
      </section>

      {items.length === 0 ? (
        <section className="rounded-3xl border border-dashed bg-white p-12 text-center">
          <Heart className="mx-auto text-[#C9A227]" />
          <h2 className="mt-4 text-2xl font-semibold">No saved portraits</h2>
          <p className="mt-2 text-neutral-500">Browse the gallery and tap the heart on a portrait you want to keep.</p>
          <Link href="/gallery" className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 font-semibold text-white">Browse Gallery</Link>
        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const image = item.images[0] ?? item.image;
            const available = item.visible && item.status === "PUBLISHED" && item.availableForSale !== false;
            return (
              <article key={item.id} className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                <div className="relative aspect-[4/5]">
                  {image?.secureUrl ? <img src={image.secureUrl} alt={image.alt ?? item.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-neutral-100 text-sm text-neutral-500">No image</div>}
                  <span className={`absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow ${available ? "text-green-700" : "text-red-700"}`}>
                    {available ? "Available" : "Not available"}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm text-neutral-500">{item.category || item.categoryId || "Portrait"}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {available && <Link href={`/commission?package=classic&artwork=${encodeURIComponent(item.id)}`} className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"><ShoppingBag size={16} /> Commission</Link>}
                    <button onClick={() => { removeFromWishlist(item.id); void load(); }} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600"><Trash2 size={16} /> Remove</button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
