"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { OrderService } from "@/services/order";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { Order } from "@/types/order";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } =
    useUserProfile();

  const [order, setOrder] =
    useState<Order | null>(null);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const canCancel = ["PAYMENT_PENDING", "PAYMENT_SUBMITTED", "PAYMENT_VERIFIED", "ARTWORK_QUEUE"].includes(order?.status ?? "");

  const cancelOrder = async () => {
    if (!user || !order || cancelling || !canCancel) return;
    const confirmed = window.confirm("Cancel this order? Payment is non-refundable. If your payment was verified, the paid amount will be credited to your reward wallet and can be used on your next order or transferred to another eligible person.");
    if (!confirmed) return;
    setCancelling(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/orders/cancel", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ orderId: order.id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Unable to cancel order.");
      window.alert(result.message ?? "Order cancelled successfully.");
      router.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Unable to cancel order.");
    } finally { setCancelling(false); }
  };

  const orderId = params?.id;

  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      router.replace(
        `/login?redirect=${encodeURIComponent(
          `/orders/${orderId}`,
        )}`,
      );
      return;
    }

    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    const unsubscribe = OrderService.subscribe(
      orderId,
      (nextOrder) => {
        if (!nextOrder) {
          setError("Order not found.");
          setOrder(null);
        } else if (
          nextOrder.customer.uid !== user.uid
        ) {
          setError(
            "You do not have access to this order.",
          );
          setOrder(null);
        } else {
          setOrder(nextOrder);
          setError(null);
        }

        setLoading(false);
      },
      (subscriptionError) => {
        console.error(
          "Customer order subscription failed:",
          subscriptionError,
        );

        setError(
          subscriptionError.message ||
            "Unable to load your order.",
        );
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [
    authLoading,
    profileLoading,
    user,
    orderId,
    router,
  ]);

  if (
    authLoading ||
    profileLoading ||
    loading
  ) {
    return (
      <main className="mx-auto max-w-6xl py-16">
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-[#C9A227]" />
          <p className="mt-4 text-sm text-neutral-500">
            Loading your order...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-6xl py-16">
        <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-semibold text-red-900">
            Unable to open order
          </h1>
          <p className="mt-3 text-sm text-red-700">
            {error ?? "Order not found."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/orders")}
            className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Back to My Orders
          </button>
        </section>
      </main>
    );
  }

  const createdDate =
    order.createdAt instanceof Date
      ? order.createdAt.toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          },
        )
      : "—";

  return (
    <main className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">
              Order Details
            </p>
            <h1 className="mt-2 font-cinzel text-4xl">
              {order.orderNumber}
            </h1>
            <p className="mt-3 text-zinc-600">
              Created on {createdDate}
            </p>
          </div>

          <span className="rounded-full bg-zinc-100 px-5 py-2 text-sm font-semibold">
            {order.status.replaceAll("_", " ")}
          </span>

          {canCancel && (
            <button type="button" onClick={() => void cancelOrder()} disabled={cancelling} className="rounded-xl border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50">{cancelling ? "Cancelling..." : "Cancel Order"}</button>
          )}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Summary
          label="Package"
          value={order.portrait.packageName}
          secondary={order.portrait.size}
        />
        <Summary
          label="Payment"
          value={order.payment.status}
          secondary={`₹${Number(
            order.payment.amount,
          ).toLocaleString("en-IN")}`}
        />
        <Summary
          label="Subjects"
          value={String(order.portrait.subjects)}
          secondary={`Orientation: ${order.portrait.orientation}`}
        />
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-8">
        <h2 className="text-2xl font-semibold">
          Order Timeline
        </h2>

        {order.timeline.length === 0 ? (
          <p className="mt-5 text-zinc-500">
            No timeline updates yet.
          </p>
        ) : (
          <div className="mt-8 space-y-8">
            {order.timeline.map(
              (event, index) => (
                <div
                  key={`${event.title}-${index}`}
                  className="flex gap-5"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] font-bold text-white">
                      ✓
                    </div>
                    {index !==
                      order.timeline.length - 1 && (
                      <div className="mt-2 h-full w-px bg-zinc-300" />
                    )}
                  </div>

                  <div className="pb-6">
                    <h3 className="font-semibold">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="mt-2 leading-7 text-zinc-600">
                        {event.description}
                      </p>
                    )}

                    {/* {event.createdAt && (
                      <p className="mt-3 text-sm text-zinc-500">
                        {event.createdAt instanceof Date
                          ? event.createdAt.toLocaleString(
                              "en-IN",
                            )
                          : ""}
                      </p>
                    )} */}
                    {event.timestamp && (
                      <p className="mt-3 text-sm text-zinc-500">
                        {event.timestamp.toDate().toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-8">
        <h2 className="text-2xl font-semibold">
          Reference Photos
        </h2>

        {order.referencePhotos.length === 0 ? (
          <p className="mt-4 text-zinc-500">
            No reference photos were uploaded.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {order.referencePhotos.map(
              (photo) => (
                <a
                  key={photo.publicId}
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overflow-hidden rounded-2xl border border-zinc-200 transition hover:shadow-lg"
                >
                  <img
                    src={photo.url}
                    alt={photo.fileName}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="border-t p-3">
                    <p className="truncate text-sm">
                      {photo.fileName}
                    </p>
                  </div>
                </a>
              ),
            )}
          </div>
        )}
      </section>

      {order.instructions && (
        <section className="rounded-3xl border border-zinc-200 bg-white p-8">
          <h2 className="text-2xl font-semibold">
            Special Instructions
          </h2>
          <p className="mt-5 whitespace-pre-wrap leading-8 text-zinc-700">
            {order.instructions}
          </p>
        </section>
      )}

      <section className="rounded-3xl border border-zinc-200 bg-white p-8">
        <h2 className="text-2xl font-semibold">Shipping & Shipment</h2>

        {order.shipping.address ? (
          <p className="mt-5 leading-7 text-zinc-700">
            {order.shipping.address.addressLine1}
            {order.shipping.address.addressLine2 && <><br />{order.shipping.address.addressLine2}</>}
            <br />{order.shipping.address.city}, {order.shipping.address.state}
            <br />{order.shipping.address.postalCode}
            <br />{order.shipping.address.country}
          </p>
        ) : (
          <p className="mt-5 text-zinc-500">Shipping address has not been added yet.</p>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Info label="Courier" value={order.shipping.courier ?? "Not dispatched"} />
          <Info label="Tracking Number" value={order.shipping.trackingNumber ?? "Not available"} />
          <Info label="Shipment Status" value={order.status.replaceAll("_", " ")} />
        </div>
        {order.shipping.trackingUrl && <a href={order.shipping.trackingUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-semibold text-black">Track Shipment</a>}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-zinc-50 p-4"><p className="text-xs uppercase tracking-wider text-zinc-400">{label}</p><p className="mt-2 font-semibold text-zinc-900">{value}</p></div>;
}

function Summary({
  label,
  value,
  secondary,
}: {
  label: string;
  value: string;
  secondary: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6">
      <p className="text-sm text-zinc-500">
        {label}
      </p>
      <h2 className="mt-2 text-2xl font-semibold">
        {value}
      </h2>
      <p className="mt-3 text-zinc-600">
        {secondary}
      </p>
    </div>
  );
}
