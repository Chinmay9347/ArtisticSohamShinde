const cloudinaryAssetBase = (
  process.env.NEXT_PUBLIC_CLOUDINARY_ASSET_BASE_URL ?? ""
).replace(/\/$/, "");

if (!cloudinaryAssetBase) {
  throw new Error(
    "NEXT_PUBLIC_CLOUDINARY_ASSET_BASE_URL is required. " +
      "Static website assets are served exclusively from Cloudinary."
  );
}

export function siteAsset(cloudinaryPath: string): string {
  return `${cloudinaryAssetBase}/${cloudinaryPath.replace(/^\//, "")}`;
}

export const SITE_ASSETS = {
  brandLogoMain: siteAsset("brand/logo-main"),
  brandLogoFull: siteAsset("brand/logo-full"),
  artistPortrait: siteAsset("about/artist/artist"),
  behindPortrait: siteAsset("about/behind-portrait"),
  heroPlaceholder: siteAsset("hero/placeholder"),
  galleryPortrait01: siteAsset("gallery/portrait-01"),
  galleryPortrait02: siteAsset("gallery/portrait-02"),
  galleryPortrait03: siteAsset("gallery/portrait-03"),
  galleryPortrait04: siteAsset("gallery/portrait-04"),
  galleryPortrait05: siteAsset("gallery/portrait-05"),
  galleryPortrait06: siteAsset("gallery/portrait-06"),
  galleryPortrait07: siteAsset("gallery/portrait-07"),
  galleryPortrait08: siteAsset("gallery/portrait-08"),
  galleryPortrait09: siteAsset("gallery/portrait-09"),
  galleryPortrait10: siteAsset("gallery/portrait-10"),
  galleryPortrait11: siteAsset("gallery/portrait-11"),
  galleryPortrait12: siteAsset("gallery/portrait-12"),
  galleryPortrait13: siteAsset("gallery/portrait-13"),
  galleryPortrait14: siteAsset("gallery/portrait-14"),
  galleryPortrait15: siteAsset("gallery/portrait-15"),
  galleryPortrait16: siteAsset("gallery/portrait-16"),
  galleryPortrait17: siteAsset("gallery/portrait-17"),
  galleryPortrait18: siteAsset("gallery/portrait-18"),
} as const;
