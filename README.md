# Artistic Soham Shinde

**Turning Memories into Timeless Art.**

Artistic Soham Shinde is a premium custom pencil-portrait and custom-artwork website with a public portfolio, customer accounts, ordering, administration, pricing, offers, delivery management, invoicing, and supporting business workflows.

## Website

https://www.artisticsohamshinde.co.in

## Technology

- Next.js 16.2.10
- React 19.2.4
- TypeScript
- Tailwind CSS v4
- Firebase / Firestore
- Cloudinary
- Resend
- Framer Motion
- Lucide React
- React Hook Form + Zod
- react-zoom-pan-pinch
- shadcn/ui
- Turbopack

## Main features

- Responsive premium portfolio and homepage
- Gallery with filtering and lightbox zoom/pan
- Customer accounts and order workflows
- Admin dashboard
- Artwork and category management
- Pricing, discounts, offers, and coupons
- Delivery and courier management
- Invoice generation
- Cloudinary-backed image delivery
- Firebase-backed application data
- Transactional email workflows through Resend
- Referral/reward-related functionality

## Local development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The development site is normally available at `http://localhost:3000`.

Production build:

```bash
npm run build
npm start
```

Lint:

```bash
npm run lint
```

## Environment configuration

Copy the required values from the example environment files:

- `.env.example`
- `.env.production.example`

Do not commit real credentials or secrets. Local `.env.local` files are intentionally ignored by Git.

The application uses Firebase, Firebase Admin, Cloudinary, Resend, and optional AI configuration. Public static image delivery can use the `NEXT_PUBLIC_CLOUDINARY_ASSET_BASE_URL` setting; local development can use the corresponding files under Cloudinary.

## Brand

**Business:** Artistic Soham Shinde  
**Tagline:** Turning Memories into Timeless Art.  
**Style:** Premium, Minimal, Elegant, Professional, Emotional  
**Colors:** Black, White, Warm Gold `#C9A227`, Grey  
**Typography:** Cinzel, Montserrat, Poppins

## Developer credit

Software.Hardware.Project.CK  
Created by Chinmay Kumbhar.

## Version note

The current `package.json` version is **2.5.0**. The name of a supplied source archive is not used as the application version.

## License

This project and its original artwork, branding, content, and implementation are proprietary to Artistic Soham Shinde / Software.Hardware.Project.CK unless otherwise stated. All rights reserved.


## Static Images & Cloudinary

The website does **not** use a `public/` folder for static website artwork.

Brand, hero, about, and portfolio images are delivered from Cloudinary using:

```text
NEXT_PUBLIC_CLOUDINARY_ASSET_BASE_URL
```

The expected Cloudinary base is:

```text
https://res.cloudinary.com/<CLOUD_NAME>/image/upload/f_auto,q_auto/artistic-soham/site-assets
```

The clean codebase contains no local copies of these website images.

### One-time asset migration

If the original project still contains the old `public/` assets, upload them to Cloudinary before running the public-free codebase:

```powershell
npm run upload-cloudinary-assets -- "C:\path\to\original\public"
```

The uploader maps the existing files to these Cloudinary public IDs:

```text
artistic-soham/site-assets/brand/logo-main
artistic-soham/site-assets/brand/logo-full
artistic-soham/site-assets/about/artist/artist
artistic-soham/site-assets/about/behind-portrait
artistic-soham/site-assets/hero/placeholder
artistic-soham/site-assets/gallery/portrait-01
...
artistic-soham/site-assets/gallery/portrait-18
```

The uploader reads Cloudinary credentials from `.env.local` when available:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

These credentials must never be committed.

After the upload succeeds, configure:

```text
NEXT_PUBLIC_CLOUDINARY_ASSET_BASE_URL=https://res.cloudinary.com/<CLOUD_NAME>/image/upload/f_auto,q_auto/artistic-soham/site-assets
```

The application will then use Cloudinary exclusively.
