"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { OrderService } from "@/services/order";
import type { Order } from "@/types/order";

import AdminOrderHeader from "@/components/features/admin/orders/AdminOrderHeader";
import AdminCustomerCard from "@/components/features/admin/orders/AdminCustomerCard";
import AdminPaymentCard from "@/components/features/admin/orders/AdminPaymentCard";
import PaymentVerificationCard from "@/components/features/admin/orders/PaymentVerificationCard";
import AdminOrderTimeline from "@/components/features/admin/orders/AdminOrderTimeline";
import { OrderWorkflowCard } from "@/components/features/admin/order-actions";

import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function AdminOrderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderId = params?.id;

  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      router.replace(
        `/login?redirect=${encodeURIComponent(
          `/admin/orders/${orderId}`,
        )}`,
      );
      return;
    }

    if (!user.emailVerified) {
      router.replace("/verify-email");
      return;
    }

    if (!profile || !profile.isActive) {
      return;
    }

    if (profile.role !== "ADMIN") {
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
        } else {
          setOrder(nextOrder);
          setError("");
        }

        setLoading(false);
      },
      (subscriptionError) => {
        console.error(
          "Admin order subscription failed:",
          subscriptionError,
        );

        setError(
          subscriptionError.message ||
            "Unable to load order.",
        );
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [
    authLoading,
    profileLoading,
    user,
    profile,
    orderId,
    router,
  ]);

  /*
   * Wait for Firebase Auth + Firestore profile.
   */
  if (authLoading || profileLoading) {
    return (
      <main className="mx-auto max-w-6xl py-16">
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-[#C9A227]" />

          <p className="mt-4 text-sm text-neutral-500">
            Checking administrator access...
          </p>
        </div>
      </main>
    );
  }

  /*
   * Auth redirect is handled by the effect.
   */
  if (!user || !profile?.isActive || profile.role !== "ADMIN") {
    return null;
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl py-16">
        <div className="space-y-6">
          <div className="h-10 w-64 animate-pulse rounded-xl bg-neutral-100" />
          <div className="h-48 animate-pulse rounded-3xl bg-neutral-100" />
          <div className="h-48 animate-pulse rounded-3xl bg-neutral-100" />
          <div className="h-48 animate-pulse rounded-3xl bg-neutral-100" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl py-16">
        <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-red-600">
            Order Error
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-red-900">
            Unable to load order
          </h1>

          <p className="mt-3 text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Back to Orders
          </button>
        </section>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8">
      {/* Order Header */}
      <AdminOrderHeader order={order} />

      {/* Customer Information */}
      <AdminCustomerCard customer={order.customer} />

      {/* Payment Information */}
      <AdminPaymentCard payment={order.payment} />

      {/* Payment Verification */}
      <PaymentVerificationCard
        orderId={order.id}
        paymentStatus={order.payment.status}
      />

      {/* Order Workflow */}
      <OrderWorkflowCard
        orderId={order.id}
        status={order.status}
      />

      {/* Order Timeline */}
      <AdminOrderTimeline timeline={order.timeline} />
    </main>
  );
}

// import { notFound } from "next/navigation";

// // Services
// import { OrderService } from "@/services/order";

// // Admin Components
// import AdminOrderHeader from "@/components/features/admin/orders/AdminOrderHeader";
// import AdminCustomerCard from "@/components/features/admin/orders/AdminCustomerCard";
// import AdminPaymentCard from "@/components/features/admin/orders/AdminPaymentCard";
// import PaymentVerificationCard from "@/components/features/admin/orders/PaymentVerificationCard";
// import AdminOrderTimeline from "@/components/features/admin/orders/AdminOrderTimeline";
// import { OrderWorkflowCard } from "@/components/features/admin/order-actions";

// export default async function AdminOrderPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   const order = await OrderService.get(id);

//   if (!order) {
//     notFound();
//   }

//   return (
//     <main className="mx-auto max-w-6xl space-y-8">

//       {/* =========================
//           Order Header
//       ========================= */}
//       <AdminOrderHeader order={order} />

//       {/* =========================
//           Customer Information
//       ========================= */}
//       <AdminCustomerCard customer={order.customer} />

//       {/* =========================
//           Payment Information
//       ========================= */}
//       <AdminPaymentCard payment={order.payment} />

//       {/* =========================
//           Payment Verification
//       ========================= */}
//       <PaymentVerificationCard
//         orderId={order.id}
//         paymentStatus={order.payment.status}
//       />
      
//       {/* =========================
//           Order Workflow
//       ========================= */}

//       <OrderWorkflowCard
//         orderId={order.id}
//         status={order.status}
//       />

//       {/* =========================
//           Order Timeline
//       ========================= */}
//       <AdminOrderTimeline timeline={order.timeline} />

//     </main>
//   );
// }

// import { notFound } from "next/navigation";

// import AdminStatusBadge from "@/components/features/admin/orders/AdminStatusBadge";
// import { OrderService } from "@/services/order";
// import PaymentVerificationCard from "@/components/features/admin/orders/PaymentVerificationCard";

// export default async function AdminOrderPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   const order = await OrderService.get(id);

//   if (!order) {
//     notFound();
//   }

//   return (
//     <main className="mx-auto max-w-6xl space-y-8">

//       <section className="rounded-3xl border bg-white p-8">

//         <div className="flex items-center justify-between">

//           <div>

//             <h1 className="font-cinzel text-4xl">
//               {order.orderNumber}
//             </h1>

//             <p className="mt-2 text-zinc-500">
//               {order.customer.fullName}
//             </p>

//           </div>

//           <AdminStatusBadge status={order.status} />

//         </div>

//       </section>

//       <section className="rounded-3xl border bg-white p-8">

//         <h2 className="text-2xl font-semibold">
//           Payment
//         </h2>

//         <div className="mt-6 grid gap-6 md:grid-cols-2">

//           <div>

//             <p className="text-sm text-zinc-500">
//               Payment Status
//             </p>

//             <AdminStatusBadge status={order.payment.status} />

//           </div>

//           <div>

//             <p className="text-sm text-zinc-500">
//               Method
//             </p>

//             <p>{order.payment.method}</p>

//           </div>

//           <div>

//             <p className="text-sm text-zinc-500">
//               Amount
//             </p>

//             <p>₹{order.payment.amount.toLocaleString("en-IN")}</p>

//           </div>

//           <div>

//             <p className="text-sm text-zinc-500">
//               Transaction ID
//             </p>

//             <p>{order.payment.transactionId}</p>

//           </div>

//           {order.payment.receipt && (

//             <div className="md:col-span-2">

//               <a
//                 href={order.payment.receipt.url}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="rounded-xl border px-5 py-3 inline-block hover:bg-zinc-100"
//               >
//                 View Receipt
//               </a>

//             </div>

//           )}

//         </div>

//       </section>
//       <PaymentVerificationCard
//         orderId={order.id}
//         paymentStatus={order.payment.status}
//       />

      

//     </main>
//   );
// }
{/* <section className="rounded-3xl border bg-white p-8">

        <h2 className="text-2xl font-semibold">
          Payment Verification
        </h2>

        <div className="mt-6 flex gap-4">

          <button
            className="rounded-xl bg-green-600 px-6 py-3 font-medium text-white"
          >
            Approve Payment
          </button>

          <button
            className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white"
          >
            Reject Payment
          </button>

        </div>

      </section> */}