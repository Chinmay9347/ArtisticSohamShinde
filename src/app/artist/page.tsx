import { ArtistDashboard } from "@/components/features/artist/ArtistDashboard";

export default async function ArtistPage() {
  // The actual user id is loaded client-side by ArtistDashboard so the
  // server page does not make assumptions about the authenticated session.
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Artist</p>
        <h2 className="mt-2 font-cinzel text-4xl font-bold">Artwork Workspace</h2>
        <p className="mt-3 max-w-2xl text-neutral-600">
          Manage commissions assigned to you, upload artwork, and move each commission through production.
        </p>
      </section>
      <ArtistDashboard />
    </div>
  );
}
