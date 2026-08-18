"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeIndianRupee, Eye, ArrowUpDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { OrderService } from "@/services/order";
import type { Order } from "@/types/order";
import { getOrderSavings } from "@/utils/orderSavings";

function money(value: number) {
  return `₹${Math.max(0, value).toLocaleString("en-IN")}`;
}

function orderTime(order: Order) {
  return order.createdAt instanceof Date
    ? order.createdAt.getTime()
    : order.createdAt?.toMillis?.() ?? 0;
}

export default function SavingsPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [draftStatus, setDraftStatus] = useState("ALL");
  const [draftBenefit, setDraftBenefit] = useState("ALL");
  const [draftSort, setDraftSort] = useState("DATE_DESC");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [benefitFilter, setBenefitFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("DATE_DESC");

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Keep this page synchronized with the same canonical customer UID
    // used by the main dashboard. This also picks up newly-created orders
    // and payment/pricing updates without requiring a manual refresh.
    const unsubscribe = OrderService.subscribeByUser(
      user.uid,
      (nextOrders) => {
        setOrders(nextOrders);
        setLoading(false);
      },
      () => {
        setOrders([]);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const rows = useMemo(() => {
    const mapped = orders
      .map((order) => ({ order, ...getOrderSavings(order) }))
      .filter(({ order, coupon, referral, reward, promotional }) => {
        const statusOk =
          statusFilter === "ALL" || order.status === statusFilter;

        const benefitValue =
          benefitFilter === "COUPON"
            ? coupon
            : benefitFilter === "REFERRAL"
              ? referral
              : benefitFilter === "REWARD"
                ? reward
                : benefitFilter === "PACKAGE"
                  ? promotional
                  : coupon + referral + reward + promotional;

        return (
          statusOk &&
          (benefitFilter === "ALL" || benefitValue > 0)
        );
      });

    return mapped.sort((a, b) => {
      if (sortBy === "SAVED_DESC") return b.saved - a.saved;
      if (sortBy === "SAVED_ASC") return a.saved - b.saved;
      if (sortBy === "ORIGINAL_DESC") return b.original - a.original;
      if (sortBy === "ORIGINAL_ASC") return a.original - b.original;
      if (sortBy === "DATE_ASC") return orderTime(a.order) - orderTime(b.order);
      return orderTime(b.order) - orderTime(a.order);
    });
  }, [orders, statusFilter, benefitFilter, sortBy]);

  const totalSaved = orders.reduce(
    (sum, order) => sum + getOrderSavings(order).saved,
    0,
  );
  const packageSaved = orders.reduce(
    (sum, order) => sum + getOrderSavings(order).promotional,
    0,
  );
  const couponSaved = orders.reduce(
    (sum, order) => sum + getOrderSavings(order).coupon,
    0,
  );
  const referralSaved = orders.reduce(
    (sum, order) => sum + getOrderSavings(order).referral,
    0,
  );
  const rewardSaved = orders.reduce(
    (sum, order) => sum + getOrderSavings(order).reward,
    0,
  );

  const applyFilter = () => {
    setStatusFilter(draftStatus);
    setBenefitFilter(draftBenefit);
    setSortBy(draftSort);
  };

  return (
    <main className="space-y-8">
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">
          Customer Benefit
        </p>
        <h1 className="mt-2 font-cinzel text-4xl">You Saved</h1>
        <p className="mt-3 max-w-3xl text-neutral-600">
          Savings are read from each order&apos;s stored pricing breakdown.
          New orders store package, coupon, referral and reward savings separately.
        </p>
      </section>

      <section className="rounded-3xl border bg-white p-7 shadow-sm">
        <p className="text-sm text-neutral-500">Total savings across all orders</p>
        <p className="mt-2 text-5xl font-bold text-[#8f7414]">
          {money(totalSaved)}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Benefit label="Package offer" value={packageSaved} />
          <Benefit label="Coupon savings" value={couponSaved} />
          <Benefit label="Referral savings" value={referralSaved} />
          <Benefit label="Reward coins used" value={rewardSaved} />
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ArrowUpDown size={16} /> Sort / Filter
          </div>

          <label className="space-y-1 text-xs">
            <span className="block text-neutral-500">Savings type</span>
            <select
              value={draftBenefit}
              onChange={(e) => setDraftBenefit(e.target.value)}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              <option value="ALL">All savings</option>
              <option value="PACKAGE">Package offer</option>
              <option value="COUPON">Coupon used</option>
              <option value="REFERRAL">Referral used</option>
              <option value="REWARD">Reward coins used</option>
            </select>
          </label>

          <label className="space-y-1 text-xs">
            <span className="block text-neutral-500">Order status</span>
            <select
              value={draftStatus}
              onChange={(e) => setDraftStatus(e.target.value)}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="PAYMENT_PENDING">Payment Pending</option>
              <option value="PAYMENT_VERIFIED">Payment Verified</option>
              <option value="ARTWORK_QUEUE">Artwork Queue</option>
              <option value="DRAWING">Drawing</option>
              <option value="QUALITY_CHECK">Quality Check</option>
              <option value="PACKAGED">Packaged</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>

          <label className="space-y-1 text-xs">
            <span className="block text-neutral-500">Sort</span>
            <select
              value={draftSort}
              onChange={(e) => setDraftSort(e.target.value)}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              <option value="DATE_DESC">Newest first</option>
              <option value="DATE_ASC">Oldest first</option>
              <option value="SAVED_DESC">Highest savings</option>
              <option value="SAVED_ASC">Lowest savings</option>
              <option value="ORIGINAL_DESC">Highest original price</option>
              <option value="ORIGINAL_ASC">Lowest original price</option>
            </select>
          </label>

          <button
            type="button"
            onClick={applyFilter}
            className="w-full rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white sm:w-auto"
          >
            Apply Filter
          </button>

          <span className="text-sm text-neutral-500 sm:col-span-2 lg:ml-auto">
            {rows.length} order{rows.length === 1 ? "" : "s"}
          </span>
        </div>
      </section>

      {loading ? (
        <section className="rounded-3xl border bg-white p-10 text-center text-neutral-500">
          Loading your savings...
        </section>
      ) : rows.length === 0 ? (
        <section className="rounded-3xl border border-dashed bg-white p-12 text-center">
          <BadgeIndianRupee className="mx-auto text-[#C9A227]" />
          <h2 className="mt-4 text-2xl font-semibold">No matching savings</h2>
          <p className="mt-2 text-neutral-500">
            Your order pricing records will appear here when savings are available.
          </p>
          <Link
            href="/commission"
            className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 font-semibold text-white"
          >
            Start a Commission
          </Link>
        </section>
      ) : (
        <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1550px] whitespace-nowrap text-sm">
              <thead className="bg-neutral-50">
                <tr className="border-b">
                  <th className="p-4 text-left">Order</th>
                  <th className="p-4 text-left">Portrait</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-right">Original</th>
                  <th className="p-4 text-right">Package Offer</th>
                  <th className="p-4 text-right">Price Before Offers</th>
                  <th className="p-4 text-right">Coupon</th>
                  <th className="p-4 text-right">Referral</th>
                  <th className="p-4 text-right">Reward Coins</th>
                  <th className="p-4 text-right">Total Saved</th>
                  <th className="p-4 text-right">Paid</th>
                  <th className="p-4 text-left">Payment</th>
                  <th className="p-4 text-left">Order Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map(
                  ({
                    order,
                    original,
                    promotional,
                    customerPriceBeforeOffers,
                    paid,
                    coupon,
                    referral,
                    reward,
                    saved,
                    legacy,
                  }) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-b-0 hover:bg-neutral-50"
                    >
                      <td className="p-4 align-top">
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="mt-1 text-xs text-neutral-400">
                          {order.id}
                        </p>
                      </td>
                      <td className="p-4 align-top">
                        <p className="font-medium">
                          {order.portrait.packageName}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {order.portrait.size} · {order.portrait.subjects}{" "}
                          subject{order.portrait.subjects === 1 ? "" : "s"}
                        </p>
                      </td>
                      <td className="p-4 align-top text-neutral-600">
                        {order.createdAt instanceof Date
                          ? order.createdAt.toLocaleString("en-IN")
                          : "—"}
                      </td>
                      <td className="p-4 text-right align-top">
                        {money(original)}
                      </td>
                      <td className="p-4 text-right align-top font-semibold text-[#8f7414]">
                        {money(promotional)}
                      </td>
                      <td className="p-4 text-right align-top">
                        {money(customerPriceBeforeOffers)}
                      </td>
                      <td className="p-4 text-right align-top">
                        {money(coupon)}
                      </td>
                      <td className="p-4 text-right align-top">
                        {money(referral)}
                      </td>
                      <td className="p-4 text-right align-top">
                        {money(reward)}
                      </td>
                      <td className="p-4 text-right align-top font-bold text-[#8f7414]">
                        {money(saved)}
                      </td>
                      <td className="p-4 text-right align-top">
                        {money(paid)}
                      </td>
                      <td className="p-4 align-top">
                        {order.payment?.status ?? "—"}
                      </td>
                      <td className="p-4 align-top">
                        {order.status.replaceAll("_", " ")}
                      </td>
                      <td className="p-4 text-right align-top">
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold hover:bg-neutral-100"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                        {legacy && (
                          <span className="ml-2 text-xs text-neutral-400">
                            legacy
                          </span>
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

function Benefit({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-4">
      <p className="text-xs uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-neutral-900">
        {money(value)}
      </p>
    </div>
  );
}
