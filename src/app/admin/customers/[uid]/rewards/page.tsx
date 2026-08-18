"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowUpDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";

interface RewardTransaction { id: string; type: "CREDIT" | "DEBIT"; source: string; amount: number; balanceAfter?: number; orderId?: string; note?: string; createdAt?: unknown; }
function time(value: unknown) { const v = value as any; const d = v?.toDate?.(); if (d instanceof Date) return d.getTime(); if (value instanceof Date) return value.getTime(); if (typeof value === "number") return value < 1e12 ? value * 1000 : value; if (typeof value === "string") return new Date(value).getTime() || 0; if (typeof v?._seconds === "number") return v._seconds * 1000; return 0; }

export default function AdminCustomerRewardHistoryPage() {
  const params = useParams<{ uid: string }>();
  const uid = String(params.uid ?? "");
  const { user: adminUser } = useAuth();
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; role: string; wallet: number } | null>(null);
  const [history, setHistory] = useState<RewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [draftType, setDraftType] = useState("ALL"); const [draftSource, setDraftSource] = useState("ALL"); const [draftSort, setDraftSort] = useState("DATE_DESC");
  const [typeFilter, setTypeFilter] = useState("ALL"); const [sourceFilter, setSourceFilter] = useState("ALL"); const [sortBy, setSortBy] = useState("DATE_DESC");

  useEffect(() => {
    if (!adminUser || !uid) return;
    let active = true; setLoading(true);
    void adminUser.getIdToken().then((token) => fetch(`/api/admin/rewards/history?uid=${encodeURIComponent(uid)}`, { headers: { Authorization: `Bearer ${token}` } })).then(async (response) => {
      const data = await response.json(); if (!response.ok) throw new Error(data.message ?? "Unable to load reward history.");
      if (!active) return; setUserInfo(data.user ?? null); setHistory((data.transactions ?? []) as RewardTransaction[]);
    }).catch((error) => { if (active) setMessage(error instanceof Error ? error.message : "Unable to load reward history."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [adminUser, uid]);

  const rows = useMemo(() => history.filter((row) => (typeFilter === "ALL" || row.type === typeFilter) && (sourceFilter === "ALL" || row.source === sourceFilter)).sort((a, b) => {
    if (sortBy === "AMOUNT_DESC") return Number(b.amount) - Number(a.amount); if (sortBy === "AMOUNT_ASC") return Number(a.amount) - Number(b.amount); return sortBy === "DATE_ASC" ? time(a.createdAt) - time(b.createdAt) : time(b.createdAt) - time(a.createdAt);
  }), [history, typeFilter, sourceFilter, sortBy]);
  const applyFilter = () => { setTypeFilter(draftType); setSourceFilter(draftSource); setSortBy(draftSort); };

  return <main className="mx-auto max-w-7xl space-y-8">
    <Link href="/admin/customers" className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:border-[#C9A227]"><ArrowLeft size={16} /> Back to User Manager</Link>
    <section><p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Administration</p><h1 className="mt-2 font-cinzel text-4xl">Reward History</h1><p className="mt-3 text-neutral-600">{userInfo?.name || userInfo?.email || uid} · {userInfo?.email || uid}</p></section>
    <section className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-wide text-neutral-500">Current Wallet</p><p className="mt-2 text-3xl font-bold text-[#8f7414]">{Number(userInfo?.wallet ?? 0).toLocaleString("en-IN")} coins</p></div><div className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-wide text-neutral-500">Credits</p><p className="mt-2 text-3xl font-bold">{history.filter((x) => x.type === "CREDIT").length}</p></div><div className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-wide text-neutral-500">Debits</p><p className="mt-2 text-3xl font-bold">{history.filter((x) => x.type === "DEBIT").length}</p></div></section>
    <section className="rounded-3xl border bg-white p-5 shadow-sm"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end"><div className="flex items-center gap-2 text-sm font-semibold"><ArrowUpDown size={16} /> Sort / Filter</div><label className="space-y-1 text-xs"><span className="block text-neutral-500">Type</span><select value={draftType} onChange={(e) => setDraftType(e.target.value)} className="rounded-xl border px-4 py-2 text-sm"><option value="ALL">All types</option><option value="CREDIT">Credit</option><option value="DEBIT">Debit</option></select></label><label className="space-y-1 text-xs"><span className="block text-neutral-500">Source</span><select value={draftSource} onChange={(e) => setDraftSource(e.target.value)} className="rounded-xl border px-4 py-2 text-sm"><option value="ALL">All sources</option><option value="REFERRAL">Referral</option><option value="ADMIN_GRANT">Admin Grant</option><option value="ADMIN_REMOVE">Admin Removal</option><option value="ORDER">Order</option><option value="CANCELLATION">Cancellation</option><option value="TRANSFER_IN">Transfer In</option><option value="TRANSFER_OUT">Transfer Out</option></select></label><label className="space-y-1 text-xs"><span className="block text-neutral-500">Sort</span><select value={draftSort} onChange={(e) => setDraftSort(e.target.value)} className="rounded-xl border px-4 py-2 text-sm"><option value="DATE_DESC">Newest first</option><option value="DATE_ASC">Oldest first</option><option value="AMOUNT_DESC">Highest amount</option><option value="AMOUNT_ASC">Lowest amount</option></select></label><button type="button" onClick={applyFilter} className="w-full rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white sm:w-auto">Apply Filter</button><span className="text-sm text-neutral-500 sm:col-span-2 lg:ml-auto">{rows.length} records</span></div></section>
    <section className="overflow-hidden rounded-3xl border bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[1000px] whitespace-nowrap text-sm"><thead className="bg-neutral-50"><tr className="border-b"><th className="p-4 text-left">Date</th><th className="p-4 text-left">Type</th><th className="p-4 text-left">Source</th><th className="p-4 text-right">Amount</th><th className="p-4 text-right">Balance After</th><th className="p-4 text-left">Order</th><th className="p-4 text-left">Note</th></tr></thead><tbody>{loading ? <tr><td colSpan={7} className="p-10 text-center text-neutral-500">Loading reward history...</td></tr> : rows.length === 0 ? <tr><td colSpan={7} className="p-10 text-center text-neutral-500">{message || "No reward history found."}</td></tr> : rows.map((row) => <tr key={row.id} className="border-b last:border-b-0 hover:bg-neutral-50"><td className="p-4">{time(row.createdAt) ? new Date(time(row.createdAt)).toLocaleString("en-IN") : "—"}</td><td className={`p-4 font-semibold ${row.type === "CREDIT" ? "text-emerald-700" : "text-red-700"}`}>{row.type}</td><td className="p-4">{row.source}</td><td className="p-4 text-right font-semibold">{row.type === "CREDIT" ? "+" : "−"}{Number(row.amount).toLocaleString("en-IN")} coins</td><td className="p-4 text-right">{row.balanceAfter == null ? "—" : `${Number(row.balanceAfter).toLocaleString("en-IN")} coins`}</td><td className="p-4">{row.orderId || "—"}</td><td className="max-w-[360px] whitespace-normal p-4 text-neutral-600">{row.note || "—"}</td></tr>)}</tbody></table></div></section>
  </main>;
}
