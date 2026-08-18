const STORAGE_KEY = "artistic-soham:wishlist:v1";

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(new Set(ids))));
}

export function getWishlistIds(): string[] {
  return readIds();
}

export function isWishlisted(id: string): boolean {
  return readIds().includes(id);
}

export function toggleWishlist(id: string): boolean {
  const ids = readIds();
  const next = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
  writeIds(next);
  return next.includes(id);
}

export function removeFromWishlist(id: string) {
  writeIds(readIds().filter((item) => item !== id));
}
