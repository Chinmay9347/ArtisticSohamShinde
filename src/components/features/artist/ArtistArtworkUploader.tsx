"use client";

import { useState } from "react";
import { uploadImage } from "@/services/cloudinary";
import { OrderService } from "@/services/order";
import { CLOUDINARY_FOLDERS } from "@/constants/cloudinary";
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@/types/order";

export function ArtistArtworkUploader({ order }: { order: Order }) {
  const { user } = useAuth();
  const [draftFile, setDraftFile] = useState<File | null>(null);
  const [finalFile, setFinalFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const upload = async (kind: "draft" | "final") => {
    const file = kind === "draft" ? draftFile : finalFile;
    if (!file || !user) return;
    try {
      setSaving(true);
      setMessage("");
      const folder = kind === "draft" ? CLOUDINARY_FOLDERS.COMMISSION_PREVIEWS : CLOUDINARY_FOLDERS.COMMISSION_COMPLETED;
      const result = await uploadImage(file, folder);
      await OrderService.update(order.id, {
        artwork: {
          ...(order.artwork ?? {}),
          ...(kind === "draft" ? { draftUrl: result.secureUrl, draftPublicId: result.publicId } : { finalUrl: result.secureUrl, finalPublicId: result.publicId }),
          uploadedBy: user.uid,
          updatedAt: new Date(),
        },
      });
      setMessage(`${kind === "draft" ? "Draft" : "Final artwork"} uploaded successfully.`);
      if (kind === "draft") setDraftFile(null); else setFinalFile(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Artwork upload failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Artwork Files</h2>
      <p className="mt-2 text-sm text-neutral-500">Upload a working preview during drawing and the final artwork when complete.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <UploadBox title="Draft / Preview" file={draftFile} setFile={setDraftFile} onUpload={() => upload("draft")} disabled={saving} />
        <UploadBox title="Final Artwork" file={finalFile} setFile={setFinalFile} onUpload={() => upload("final")} disabled={saving} />
      </div>

      {(order.artwork?.draftUrl || order.artwork?.finalUrl) && (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {order.artwork.draftUrl && <a href={order.artwork.draftUrl} target="_blank" rel="noreferrer" className="rounded-xl border p-4 text-sm font-medium hover:bg-neutral-50">Open current draft</a>}
          {order.artwork.finalUrl && <a href={order.artwork.finalUrl} target="_blank" rel="noreferrer" className="rounded-xl border p-4 text-sm font-medium hover:bg-neutral-50">Open current final</a>}
        </div>
      )}
      {message && <p className="mt-4 text-sm text-neutral-600">{message}</p>}
    </section>
  );
}

function UploadBox({ title, file, setFile, onUpload, disabled }: { title: string; file: File | null; setFile: (file: File | null) => void; onUpload: () => void; disabled: boolean }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-5">
      <h3 className="font-medium">{title}</h3>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-4 block w-full text-sm" />
      <button type="button" disabled={!file || disabled} onClick={onUpload} className="mt-4 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Upload</button>
    </div>
  );
}
