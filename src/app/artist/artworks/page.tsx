"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { OrderService } from "@/services/order";
import { ArtistStatusChangeButton } from "@/components/features/artist/ArtistStatusChangeButton";
import type { Order } from "@/types/order";

async function downloadImage(
  url: string,
  fileName: string,
) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to download artwork image.");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export default function ArtistArtworksPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const unsubscribe = OrderService.subscribeByArtist(
      user.uid,
      (next) => {
        setOrders(next);
        setLoading(false);
      },
      () => setLoading(false),
    );

    return () => unsubscribe();
  }, [user]);

  const download = async (
    url: string,
    fileName: string,
  ) => {
    try {
      setDownloadError("");
      await downloadImage(url, fileName);
    } catch (error) {
      console.error("Artwork download failed:", error);
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Unable to download artwork.",
      );
    }
  };

  return (
    <main className="min-w-0 space-y-8">
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">
          Artist Workspace
        </p>
        <h1 className="mt-2 font-cinzel text-4xl">
          Artwork Manager
        </h1>
        <p className="mt-3 text-neutral-600">
          Manage assigned artwork, production status, and artwork files.
        </p>
      </section>

      {downloadError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {downloadError}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border bg-white p-8">
          Loading artwork...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-white p-10 text-center text-neutral-500">
          No assigned artworks yet.
        </div>
      ) : (
        <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold">
              Assigned Artwork
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              One row per assigned order.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="p-4 text-left">Order</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Artwork</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Files</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="align-top">
                    <td className="p-4">
                      <p className="font-semibold">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {order.portrait.packageName} ·{" "}
                        {order.portrait.size}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold">
                        {order.customer.fullName}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {order.customer.email}
                      </p>
                    </td>

                    <td className="p-4">
                      {order.artwork?.finalUrl ||
                      order.artwork?.draftUrl ? (
                        <div className="flex gap-2">
                          {order.artwork.draftUrl && (
                            <img
                              src={order.artwork.draftUrl}
                              alt="Draft artwork"
                              className="h-16 w-16 rounded-lg border object-cover"
                            />
                          )}
                          {order.artwork.finalUrl && (
                            <img
                              src={order.artwork.finalUrl}
                              alt="Final artwork"
                              className="h-16 w-16 rounded-lg border object-cover"
                            />
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-400">
                          No artwork uploaded
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="whitespace-nowrap rounded-full border-2 border-[#C9A227] px-3 py-1 text-xs font-semibold">
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {order.artwork?.draftUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              void download(
                                order.artwork!.draftUrl!,
                                `${order.orderNumber}-draft.jpg`,
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-neutral-50"
                          >
                            Download Draft
                          </button>
                        )}

                        {order.artwork?.finalUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              void download(
                                order.artwork!.finalUrl!,
                                `${order.orderNumber}-final.jpg`,
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-neutral-50"
                          >
                            Download Final
                          </button>
                        )}

                        {!order.artwork?.draftUrl &&
                          !order.artwork?.finalUrl && (
                            <span className="text-xs text-neutral-400">
                              No files
                            </span>
                          )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/artist/orders/${order.id}`}
                          className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white"
                        >
                          View Order
                        </Link>

                        <ArtistStatusChangeButton
                          order={order}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
