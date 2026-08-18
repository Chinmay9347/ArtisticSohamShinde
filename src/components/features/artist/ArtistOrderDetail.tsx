"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@/types/order";
import { ArtistArtworkUploader } from "./ArtistArtworkUploader";
import { OrderService } from "@/services/order";
import { ArtistStatusChangeButton } from "./ArtistStatusChangeButton";

export function ArtistOrderDetail({ order }: { order: Order }) {
  const { user } = useAuth();
  const router = useRouter();

  if (user && order.artist?.uid !== user.uid) {
    return <div className="rounded-2xl border bg-white p-8">This commission is not assigned to your artist account.</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm text-neutral-500">{order.orderNumber}</p>
        <h1 className="mt-2 font-cinzel text-4xl">{order.customer.fullName}</h1>
        <div className="mt-4 inline-flex rounded-full border-2 border-[#C9A227] bg-white px-4 py-2 text-sm font-semibold">Current Status: {order.status.replaceAll("_", " ")}</div>
        <p className="mt-2 text-neutral-500">{order.portrait.packageName} · {order.portrait.size} · {order.portrait.subjects} subject(s)</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <StatusBadge status={order.status} />
          <ArtistStatusChangeButton order={order} />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Customer Instructions</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-neutral-600">{order.instructions || "No instructions provided."}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Reference Photos</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {order.referencePhotos.map((photo) => (
              <a key={photo.publicId} href={photo.url} target="_blank" rel="noreferrer" className="overflow-hidden rounded-xl border">
                <img src={photo.url} alt={photo.fileName} className="aspect-square w-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <ArtistArtworkUploader order={order} />

      <ArtistShipmentEditor order={order} />

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Artwork Production</h2>
        <p className="mt-2 text-sm text-neutral-500">Use the status workflow to keep the customer and admin informed.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {["ARTWORK_QUEUE", "DRAWING", "QUALITY_CHECK", "PACKAGED"].map((step) => (
            <div key={step} className={`rounded-xl p-4 text-center text-sm ${order.status === step ? "bg-[#C9A227] font-semibold" : "bg-neutral-100 text-neutral-500"}`}>
              {step.replaceAll("_", " ")}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


function ArtistShipmentEditor({ order }: { order: Order }) {
  const router = useRouter();
  const [courier, setCourier] = useState(order.shipping?.courier ?? "");
  const [trackingNumber, setTrackingNumber] = useState(order.shipping?.trackingNumber ?? "");
  const [trackingUrl, setTrackingUrl] = useState(order.shipping?.trackingUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const save = async () => {
    setSaving(true);
    try {
      await OrderService.updateShipping(order.id, { ...order.shipping, courier, trackingNumber, trackingUrl });
      setMessage("Shipment details updated.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update shipment details.");
    } finally { setSaving(false); }
  };

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Shipment Details</h2>
      <p className="mt-2 text-sm text-neutral-500">Update courier and tracking information for this assigned commission.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="Courier" className="rounded-xl border px-4 py-3" />
        <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Tracking number" className="rounded-xl border px-4 py-3" />
        <input value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} placeholder="Tracking URL" className="rounded-xl border px-4 py-3" />
      </div>
      <button disabled={saving} onClick={save} className="mt-4 rounded-xl bg-[#C9A227] px-5 py-3 font-semibold text-black disabled:opacity-50">{saving ? "Saving..." : "Save Shipment Details"}</button>
      {message && <p className="mt-3 text-sm text-neutral-600">{message}</p>}
    </section>
  );
}

function StatusBadge({status}:{status:string}){const map:Record<string,string>={DRAWING:"border-yellow-400 bg-yellow-50 text-yellow-800",QUALITY_CHECK:"border-yellow-400 bg-yellow-50 text-yellow-800",ARTWORK_QUEUE:"border-yellow-400 bg-yellow-50 text-yellow-800",PACKAGED:"border-sky-400 bg-sky-50 text-sky-800",SHIPPED:"border-blue-400 bg-blue-50 text-blue-800",DELIVERED:"border-green-400 bg-green-50 text-green-800",COMPLETED:"border-green-500 bg-green-50 text-green-800",CANCELLED:"border-red-400 bg-red-50 text-red-800"};return <span className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${map[status]??"border-neutral-300 bg-neutral-50 text-neutral-700"}`}>{status.replaceAll("_"," ")}</span>}
