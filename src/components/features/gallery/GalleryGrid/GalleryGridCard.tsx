"use client";

import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { GalleryDocument } from "@/services/gallery/gallery.types";
import { galleryGridStyles } from "./GalleryGrid.styles";
import { isWishlisted, toggleWishlist } from "@/services/wishlist";
import { useAuth } from "@/context/AuthContext";

interface Props {
  item: GalleryDocument;
  onClick?: () => void;
}

export function GalleryGridCard({ item, onClick }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const primaryImage = item.images[0] ?? item.image;
  const available = item.visible && item.status === "PUBLISHED" && item.availableForSale !== false;

  useEffect(() => {
    setSaved(isWishlisted(item.id));
  }, [item.id]);

  function save() {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/gallery")}`);
      return;
    }
    setSaved(toggleWishlist(item.id));
  }

  return (
    <article
      className={`${galleryGridStyles.card} cursor-pointer`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={primaryImage?.secureUrl ?? "/placeholder-image.jpg"}
          alt={primaryImage?.alt ?? item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={galleryGridStyles.image}
        />

        <div className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm">
          {available ? <span className="text-green-700">Available</span> : <span className="text-red-700">Not available</span>}
        </div>

        <button
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(event) => { event.stopPropagation(); save(); }}
          className={`absolute right-4 top-4 z-10 rounded-full p-3 shadow-md backdrop-blur ${
            saved ? "bg-[#C9A227] text-black" : "bg-white/90 text-black"
          }`}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className={galleryGridStyles.content}>
        <h3 className={galleryGridStyles.title}>{item.title}</h3>
        <p className={galleryGridStyles.category}>{item.category || item.categoryId || "Portrait"}</p>

        {available && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/commission?artwork=${encodeURIComponent(item.id)}`);
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            <ShoppingBag size={16} /> Order This
          </button>
        )}
      </div>
    </article>
  );
}
