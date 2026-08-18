"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  RefreshCw,
} from "lucide-react";

import { OrderService } from "@/services/order";
import type { Order } from "@/types/order";
import AdminStatusBadge from "@/components/features/admin/orders/AdminStatusBadge";

export default function AdminInvoicesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] =
    useState("ALL");

  useEffect(() => {
    const unsubscribe =
      OrderService.subscribeAll(
        (nextOrders) => {
          setOrders(nextOrders);
          setLoading(false);
        },
        (error) => {
          console.error(
            "Admin invoice subscription failed:",
            error,
          );
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return orders.filter((order) => {
      const searchText = [
        order.orderNumber,
        order.customer.fullName,
        order.customer.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchText.includes(query);

      const matchesPayment =
        paymentStatus === "ALL" ||
        order.payment?.status ===
          paymentStatus;

      return (
        matchesSearch &&
        matchesPayment
      );
    });
  }, [
    orders,
    search,
    paymentStatus,
  ]);

  const totalAmount = useMemo(() => {
    return filteredOrders.reduce(
      (total, order) =>
        total +
        Number(
          order.payment?.amount ?? 0,
        ),
      0,
    );
  }, [filteredOrders]);

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">
          Administration
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-cinzel text-4xl">
              Invoice Management
            </h1>

            <p className="mt-3 max-w-2xl text-neutral-600">
              View and manage invoices for all
              customer orders.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm text-neutral-600">
            <FileText size={18} />

            <span>
              {filteredOrders.length} invoices
            </span>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Total Invoices"
          value={filteredOrders.length}
        />

        <SummaryCard
          label="Paid / Verified"
          value={
            filteredOrders.filter(
              (order) =>
                order.payment?.status ===
                "VERIFIED",
            ).length
          }
        />

        <SummaryCard
          label="Invoice Value"
          value={`₹${totalAmount.toLocaleString(
            "en-IN",
          )}`}
        />
      </section>

      {/* Filters */}
      <section className="rounded-3xl border bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search order, customer or email"
              className="w-full rounded-xl border border-zinc-200 py-3 pl-10 pr-4 outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            />
          </label>

          <select
            value={paymentStatus}
            onChange={(event) =>
              setPaymentStatus(
                event.target.value,
              )
            }
            className="rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-[#C9A227]"
          >
            <option value="ALL">
              All Payment Status
            </option>
            <option value="PENDING">
              Pending
            </option>
            <option value="SUBMITTED">
              Submitted
            </option>
            <option value="VERIFIED">
              Verified
            </option>
            <option value="REJECTED">
              Rejected
            </option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setPaymentStatus("ALL");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium transition hover:bg-zinc-50"
          >
            <RefreshCw size={17} />

            Reset
          </button>
        </div>
      </section>

      {/* Invoice Table */}
      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-zinc-100">
              <tr>
                <th className="p-4 text-left">
                  Sr. No.
                </th>

                <th className="p-4 text-left whitespace-nowrap">
                  Invoice
                </th>

                <th className="p-4 text-left whitespace-nowrap">
                  Order
                </th>

                <th className="p-4 text-left whitespace-nowrap">
                  Customer
                </th>

                <th className="p-4 text-left whitespace-nowrap">
                  Amount
                </th>

                <th className="p-4 text-left whitespace-nowrap">
                  Payment
                </th>

                <th className="p-4 text-left whitespace-nowrap">
                  Order Status
                </th>

                <th className="p-4 text-left whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-12 text-center text-neutral-500"
                  >
                    Loading invoices...
                  </td>
                </tr>
              ) : filteredOrders.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-12 text-center text-neutral-500"
                  >
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(
                  (order, index) => (
                    <tr
                      key={order.id}
                      className="border-t transition hover:bg-zinc-50"
                    >
                      <td className="p-4">
                        {index + 1}
                      </td>

                      <td className="p-4 font-semibold">
                        INV-
                        {order.orderNumber}
                      </td>

                      <td className="p-4">
                        {order.orderNumber}
                      </td>

                      <td className="p-4">
                        <p className="font-medium">
                          {
                            order.customer
                              .fullName
                          }
                        </p>

                        <p className="text-xs text-neutral-400">
                          {
                            order.customer
                              .email
                          }
                        </p>
                      </td>

                      <td className="p-4 font-semibold whitespace-nowrap">
                        ₹
                        {Number(
                          order.payment
                            ?.amount ?? 0,
                        ).toLocaleString(
                          "en-IN",
                        )}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <AdminStatusBadge
                          status={
                            order.payment
                              ?.status ??
                            "NONE"
                          }
                        />
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <AdminStatusBadge
                          status={
                            order.status
                          }
                        />
                      </td>

                      <td className="p-4">
                        <Link
                          href={`/invoices/${order.id}`}
                          className="inline-flex whitespace-nowrap rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                        >
                          View Invoice
                        </Link>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-neutral-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-zinc-900">
        {value}
      </p>
    </div>
  );
}