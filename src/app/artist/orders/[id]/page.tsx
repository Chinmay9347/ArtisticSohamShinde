"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

import { OrderService } from "@/services/order";
import type { Order } from "@/types/order";

import { ArtistOrderDetail } from "@/components/features/artist/ArtistOrderDetail";

export default function ArtistOrderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params?.id;

  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      router.replace(
        `/login?redirect=${encodeURIComponent(
          `/artist/orders/${orderId}`,
        )}`,
      );
      return;
    }

    if (!profile || !profile.isActive) {
      return;
    }

    if (profile.role !== "ARTIST") {
      router.replace("/dashboard");
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
          nextOrder.artist?.uid !== user.uid
        ) {
          setError(
            "This commission is not assigned to your artist account.",
          );
          setOrder(null);
        } else {
          setOrder(nextOrder);
          setError("");
        }

        setLoading(false);
      },
      (subscriptionError) => {
        console.error(
          "Artist order subscription failed:",
          subscriptionError,
        );

        setError(
          subscriptionError.message ||
            "Unable to load this commission.",
        );
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [
    authLoading,
    profileLoading,
    profile,
    user,
    orderId,
    router,
  ]);

  if (authLoading || profileLoading) {
    return (
      <main className="mx-auto max-w-6xl py-16">
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-[#C9A227]" />

          <p className="mt-4 text-sm text-neutral-500">
            Checking artist access...
          </p>
        </div>
      </main>
    );
  }

  if (!user || !profile || profile.role !== "ARTIST") {
    return null;
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl py-16">
        <div className="space-y-6">
          <div className="h-10 w-72 animate-pulse rounded-xl bg-neutral-100" />

          <div className="h-48 animate-pulse rounded-3xl bg-neutral-100" />

          <div className="h-64 animate-pulse rounded-3xl bg-neutral-100" />

          <div className="h-64 animate-pulse rounded-3xl bg-neutral-100" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl py-16">
        <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-red-600">
            Artist Order
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-red-900">
            Unable to open commission
          </h1>

          <p className="mt-3 text-sm text-red-700">
            {error}
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  return <ArtistOrderDetail order={order} />;
}

// import { notFound } from "next/navigation";
// import { ArtistOrderDetail } from "@/components/features/artist/ArtistOrderDetail";
// import { OrderService } from "@/services/order";

// export default async function ArtistOrderPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   const order = await OrderService.get(id);
//   if (!order) notFound();
//   return <ArtistOrderDetail order={order} />;
// }
