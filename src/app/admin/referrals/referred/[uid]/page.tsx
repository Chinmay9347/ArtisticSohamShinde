"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpDown, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getAllUsers } from "@/services/user";
import { getReferrals } from "@/services/referrals";
import type { ReferralDocument } from "@/types/referral";

interface UserRow {
  uid: string;
  name?: string;
  email?: string;
}

type SortKey = "NAME" | "STATUS" | "DATE";

function time(value: unknown) {
  const v = value as any;
  const d = v?.toDate?.();
  if (d instanceof Date) return d.getTime();
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value < 1e12 ? value * 1000 : value;
  if (typeof value === "string") return new Date(value).getTime() || 0;
  if (typeof v?._seconds === "number") return v._seconds * 1000;
  return 0;
}

export default function AdminReferredUsersPage() {
  const params = useParams<{ uid: string }>();
  const uid = String(params.uid ?? "");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [referrals, setReferrals] = useState<ReferralDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftSearch, setDraftSearch] = useState("");
  const [draftStatus, setDraftStatus] = useState("ALL");
  const [draftSort, setDraftSort] = useState<SortKey>("DATE");
  const [draftSortDir, setDraftSortDir] = useState<"ASC" | "DESC">("DESC");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState<SortKey>("DATE");
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    void Promise.all([getAllUsers(), getReferrals()])
      .then(([allUsers, allReferrals]) => {
        setUsers(allUsers as UserRow[]);
        setReferrals(allReferrals);
      })
      .finally(() => setLoading(false));
  }, []);

  const referrer = users.find((user) => user.uid === uid);

  const rows = useMemo(() => {
    const userMap = new Map(users.map((user) => [user.uid, user]));
    const filtered = referrals
      .filter((referral) => referral.referrerUserId === uid && Boolean(referral.referredUserId))
      .map((referral) => ({
        referral,
        referred: userMap.get(String(referral.referredUserId)),
      }))
      .filter(({ referral, referred }) => {
        const haystack = `${referred?.name ?? ""} ${referred?.email ?? ""} ${referral.referredUserId ?? ""} ${referral.referralCode}`.toLowerCase();
        return (
          (status === "ALL" || referral.status === status) &&
          (!search || haystack.includes(search.toLowerCase()))
        );
      });

    filtered.sort((a, b) => {
      let result = 0;
      if (sortBy === "NAME") {
        result = (a.referred?.name ?? a.referred?.email ?? a.referral.referredUserId ?? "").localeCompare(
          b.referred?.name ?? b.referred?.email ?? b.referral.referredUserId ?? "",
        );
      } else if (sortBy === "STATUS") {
        result = a.referral.status.localeCompare(b.referral.status);
      } else {
        result = time(a.referral.createdAt) - time(b.referral.createdAt);
      }
      return sortDir === "ASC" ? result : -result;
    });

    return filtered;
  }, [referrals, users, uid, search, status, sortBy, sortDir]);

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <Link href="/admin/referrals" className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:border-[#C9A227]">
        <ArrowLeft size={16} /> Back to Referral Manager
      </Link>

      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Referral Manager</p>
        <h1 className="mt-2 font-cinzel text-4xl">Referred Users</h1>
        <p className="mt-3 text-neutral-600">
          {referrer?.name || referrer?.email || uid} — only customers who actually used this referrer&apos;s code are shown.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Referred Users" value={rows.length} />
        <Stat label="Qualified" value={rows.filter((row) => row.referral.status === "QUALIFIED" || row.referral.status === "REWARDED").length} />
        <Stat label="Pending" value={rows.filter((row) => row.referral.status === "PENDING").length} />
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
          <label className="min-w-[240px] flex-1 space-y-1 text-xs">
            <span className="block text-neutral-500">Search</span>
            <input value={draftSearch} onChange={(e) => setDraftSearch(e.target.value)} placeholder="Search referred user" className="w-full rounded-xl border px-4 py-2.5 text-sm" />
          </label>
          <label className="space-y-1 text-xs">
            <span className="block text-neutral-500">Status</span>
            <select value={draftStatus} onChange={(e) => setDraftStatus(e.target.value)} className="rounded-xl border px-4 py-2.5 text-sm">
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="REWARDED">Rewarded</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>
          <label className="space-y-1 text-xs">
            <span className="block text-neutral-500">Sort</span>
            <select value={`${draftSort}:${draftSortDir}`} onChange={(e) => { const [key, dir] = e.target.value.split(":") as [SortKey, "ASC" | "DESC"]; setDraftSort(key); setDraftSortDir(dir); }} className="rounded-xl border px-4 py-2.5 text-sm">
              <option value="DATE:DESC">Newest first</option>
              <option value="DATE:ASC">Oldest first</option>
              <option value="NAME:ASC">Name A–Z</option>
              <option value="NAME:DESC">Name Z–A</option>
              <option value="STATUS:ASC">Status A–Z</option>
            </select>
          </label>
          <button type="button" onClick={() => { setSearch(draftSearch); setStatus(draftStatus); setSortBy(draftSort); setSortDir(draftSortDir); }} className="w-full rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white sm:w-auto">
            Apply Filter
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b p-5 text-sm text-neutral-500">
          <ArrowUpDown size={16} /> Sorted/filtered table · {rows.length} used referral relationship{rows.length === 1 ? "" : "s"}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] whitespace-nowrap text-sm">
            <thead className="bg-neutral-50">
              <tr className="border-b">
                <th className="p-4 text-left">Sr. No.</th>
                <th className="p-4 text-left">Referred User</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Referral Code</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Customer Discount</th>
                <th className="p-4 text-right">Referrer Reward</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Order</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="p-10 text-center text-neutral-500">Loading referred users...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={9} className="p-10 text-center text-neutral-500"><Users className="mx-auto mb-3" />No customer has used this referral code yet.</td></tr>
              ) : rows.map(({ referral, referred }, index) => (
                <tr key={referral.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-semibold">{referred?.name || referral.referredUserId}</td>
                  <td className="p-4 text-neutral-600">{referred?.email || "—"}</td>
                  <td className="p-4 font-semibold">{referral.referralCode}</td>
                  <td className="p-4 uppercase">{referral.status}</td>
                  <td className="p-4 text-right">₹{Number(referral.referredCustomerDiscount ?? 0).toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right font-semibold text-[#8f7414]">₹{Number(referral.referrerReward ?? 0).toLocaleString("en-IN")}</td>
                  <td className="p-4">{time(referral.createdAt) ? new Date(time(referral.createdAt)).toLocaleString("en-IN") : "—"}</td>
                  <td className="p-4">{referral.referredOrderId || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>;
}
