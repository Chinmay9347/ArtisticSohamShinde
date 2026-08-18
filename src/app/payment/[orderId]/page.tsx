"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { OrderService } from "@/services/order";
import { PaymentAccountService } from "@/services/payment-account";
import { PaymentPageContent } from "@/components/features/payment/PaymentPageContent";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

import type { Order } from "@/types/order";
import type { PaymentAccount } from "@/types/payment-account";

export default function PaymentPage() {
  const params =
    useParams<{ orderId: string }>();
  const router = useRouter();

  const { user, loading: authLoading } =
    useAuth();
  const {
    profile,
    loading: profileLoading,
  } = useUserProfile();

  const [order, setOrder] =
    useState<Order | null>(null);
  const [paymentAccounts, setPaymentAccounts] =
    useState<PaymentAccount[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const orderId = params?.orderId;

  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      router.replace(
        `/login?redirect=${encodeURIComponent(
          `/payment/${orderId}`,
        )}`,
      );
      return;
    }

    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    let active = true;

    const unsubscribe =
      OrderService.subscribe(
        orderId,
        (nextOrder) => {
          if (!active) return;

          if (!nextOrder) {
            setError("Order not found.");
            setOrder(null);
          } else if (
            nextOrder.customer.uid !==
            user.uid
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
            "Payment order subscription failed:",
            subscriptionError,
          );

          if (active) {
            setError(
              subscriptionError.message ||
                "Unable to load payment details.",
            );
            setLoading(false);
          }
        },
      );

    void PaymentAccountService.getEnabled()
      .then((accounts) => {
        if (active) {
          setPaymentAccounts(accounts);
        }
      })
      .catch((accountsError) => {
        console.error(
          "Payment account loading failed:",
          accountsError,
        );

        if (active) {
          setError(
            "Payment destination details are currently unavailable.",
          );
        }
      });

    return () => {
      active = false;
      unsubscribe();
    };
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
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-[#C9A227]" />
          <p className="mt-4 text-sm text-neutral-500">
            Preparing secure payment...
          </p>
        </div>
      </main>
    );
  }

  if (!user || !profile) {
    return null;
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-semibold text-red-900">
            Unable to open payment
          </h1>
          <p className="mt-3 text-sm text-red-700">
            {error ?? "Order not found."}
          </p>
          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/orders")
            }
            className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Back to Orders
          </button>
        </section>
      </main>
    );
  }

  if (
    order.payment.status === "VERIFIED"
  ) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <section className="rounded-3xl border border-green-200 bg-green-50 p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-green-700">
            Payment Verified
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-green-900">
            Your payment is already verified.
          </h1>
          <p className="mt-3 text-green-800">
            Order {order.orderNumber} is now in production workflow.
          </p>
          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/orders")
            }
            className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            View My Orders
          </button>
        </section>
      </main>
    );
  }

  return (
    <PaymentPageContent
      order={order}
      paymentAccounts={paymentAccounts}
    />
  );
}
