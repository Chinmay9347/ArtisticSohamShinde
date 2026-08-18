"use client";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/user";
import { ArtistService } from "@/services/order/artist.service";

interface Artist { uid: string; name?: string; email?: string; role?: string; isActive?: boolean; }
export default function AssignArtistDialog({ orderId, currentArtistId }: { orderId: string; currentArtistId?: string }) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistId, setArtistId] = useState(currentArtistId ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    getAllUsers().then((items) => {
      const active = (items as Artist[]).filter((u) => u.role === "ARTIST" && u.isActive !== false);
      setArtists(active);
      if (!currentArtistId && active.length === 1) setArtistId(active[0].uid);
    });
  }, [currentArtistId]);
  async function assign() {
    const artist = artists.find((item) => item.uid === artistId);
    if (!artist) return;
    setLoading(true); setMessage("");
    try { await ArtistService.assign(orderId, artist.uid, artist.name || artist.email || artist.uid); setMessage("Artist assigned."); location.reload(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to assign artist."); }
    finally { setLoading(false); }
  }
  if (artists.length === 0) return <span className="text-sm text-neutral-500">No active artist available.</span>;
  return <div className="flex flex-wrap items-center gap-2">
    <select value={artistId} onChange={(e) => setArtistId(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
      <option value="">Select artist</option>{artists.map((artist) => <option key={artist.uid} value={artist.uid}>{artist.name || artist.email || artist.uid}</option>)}
    </select>
    <button onClick={assign} disabled={!artistId || loading} className="rounded-xl bg-[#C9A227] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50">{loading ? "Assigning..." : "Assign Artist"}</button>
    {message && <span className="text-xs text-neutral-500">{message}</span>}
  </div>;
}
