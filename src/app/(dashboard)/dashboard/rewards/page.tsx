"use client";

import Link from "next/link";
import { Gift, Star, Send, ArrowUpDown } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface RewardTransaction {
  id: string;
  type: "CREDIT" | "DEBIT";
  source: string;
  amount: number;
  balanceAfter?: number;
  orderId?: string;
  note?: string;
  createdAt?: unknown;
}

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

export default function RewardsPage() {
  const { profile } = useUserProfile();
  const { user } = useAuth();
  const coins = Number(profile?.referralRewardCoins ?? 0);
  const isArtist = profile?.role === "ARTIST";
  const transferType = isArtist ? "ARTIST2C" : "C2C";
  const transferLabel = isArtist ? "Artist → Customer" : "Transfer to Friend";

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<RewardTransaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [draftType, setDraftType] = useState("ALL");
  const [draftSource, setDraftSource] = useState("ALL");
  const [draftSort, setDraftSort] = useState("DATE_DESC");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("DATE_DESC");

  useEffect(() => {
    if (!user) return;
    setHistoryLoading(true);
    void user.getIdToken()
      .then((token) =>
        fetch("/api/rewards/history", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Unable to load reward history.");
        setHistory((data.transactions ?? []) as RewardTransaction[]);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Unable to load reward history."))
      .finally(() => setHistoryLoading(false));
  }, [user]);

  const transfer = async () => {
    if (!user || amount <= 0 || !recipient.trim()) {
      setMessage("Enter a recipient email and a valid coin amount.");
      return;
    }
    if (amount > coins) {
      setMessage(`You only have ${coins} coin(s) available.`);
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/rewards/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipient, amount, type: transferType }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Transfer failed.");
      setRecipient("");
      setAmount(0);
      toast.success(`${amount} reward coin(s) transferred successfully.`);
      window.location.reload();
    } catch (error) {
      const text = error instanceof Error ? error.message : "Transfer failed.";
      setMessage(text);
      toast.error(text);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = useMemo(() => {
    const rows = history.filter((row) =>
      (typeFilter === "ALL" || row.type === typeFilter) &&
      (sourceFilter === "ALL" || row.source === sourceFilter),
    );
    return rows.sort((a, b) => {
      if (sortBy === "AMOUNT_DESC") return Number(b.amount) - Number(a.amount);
      if (sortBy === "AMOUNT_ASC") return Number(a.amount) - Number(b.amount);
      return sortBy === "DATE_ASC" ? time(a.createdAt) - time(b.createdAt) : time(b.createdAt) - time(a.createdAt);
    });
  }, [history, typeFilter, sourceFilter, sortBy]);

  const applyHistoryFilter = () => {
    setTypeFilter(draftType);
    setSourceFilter(draftSource);
    setSortBy(draftSort);
  };

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Loyalty & Referral</p>
        <h1 className="mt-2 font-cinzel text-4xl">Rewards</h1>
        <p className="mt-3 text-neutral-600">Referral Reward Wallet is the single customer-facing reward balance. 1 coin = ₹1.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-neutral-50 p-6">
            <Star className="text-[#C9A227]" />
            <p className="mt-3 text-sm text-neutral-500">Referral Reward Wallet</p>
            <p className="mt-1 text-4xl font-bold">{coins} coins</p>
            <p className="mt-2 text-sm text-neutral-500">Available value: ₹{coins.toLocaleString("en-IN")}</p>
            <Link href="/commission" className="mt-4 inline-flex rounded-xl bg-[#C9A227] px-4 py-2 text-sm font-semibold text-black">Use Rewards in an Order</Link>
          </div>

          <div className="rounded-2xl bg-black p-6 text-white">
            <Gift className="text-[#C9A227]" />
            <p className="mt-3 text-sm text-white/60">Reward Transfer</p>
            <p className="mt-2 font-semibold">{transferLabel}</p>
            <p className="mt-1 text-xs text-white/50">Transfer is available according to your account type.</p>
            <div className="mt-4 grid gap-3">
              <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient email" className="rounded-xl bg-white px-4 py-3 text-black outline-none" />
              <input type="number" min="1" max={coins} value={amount || ""} onChange={(e) => setAmount(Math.max(0, Math.floor(Number(e.target.value) || 0)))} placeholder="Coins" className="rounded-xl bg-white px-4 py-3 text-black outline-none" />
              <button type="button" disabled={loading || coins <= 0} onClick={() => void transfer()} className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-4 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"><Send size={16} />{loading ? "Transferring..." : transferLabel}</button>
              {message && <p className="text-sm text-red-200">{message}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Reward History</h2>
          <p className="mt-1 text-sm text-neutral-500">Every reward credit and reward usage is recorded separately.</p>
        </div>
        <div className="border-b bg-neutral-50 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
            <div className="flex items-center gap-2 text-sm font-semibold"><ArrowUpDown size={16} /> Sort / Filter</div>
            <label className="space-y-1 text-xs"><span className="block text-neutral-500">Type</span><select value={draftType} onChange={(e) => setDraftType(e.target.value)} className="rounded-xl border bg-white px-4 py-2 text-sm"><option value="ALL">All types</option><option value="CREDIT">Credit</option><option value="DEBIT">Used / Debit</option></select></label>
            <label className="space-y-1 text-xs"><span className="block text-neutral-500">Source</span><select value={draftSource} onChange={(e) => setDraftSource(e.target.value)} className="rounded-xl border bg-white px-4 py-2 text-sm"><option value="ALL">All sources</option><option value="REFERRAL">Referral</option><option value="ORDER">Order</option><option value="TRANSFER_IN">Transfer In</option><option value="TRANSFER_OUT">Transfer Out</option><option value="ADMIN_GRANT">Admin Grant</option></select></label>
            <label className="space-y-1 text-xs"><span className="block text-neutral-500">Sort</span><select value={draftSort} onChange={(e) => setDraftSort(e.target.value)} className="rounded-xl border bg-white px-4 py-2 text-sm"><option value="DATE_DESC">Newest first</option><option value="DATE_ASC">Oldest first</option><option value="AMOUNT_DESC">Highest amount</option><option value="AMOUNT_ASC">Lowest amount</option></select></label>
            <button type="button" onClick={applyHistoryFilter} className="w-full rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white sm:w-auto">Apply Filter</button>
            <span className="text-sm text-neutral-500 sm:col-span-2 lg:ml-auto">{filteredHistory.length} records</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] whitespace-nowrap text-sm">
            <thead className="bg-neutral-50">
              <tr className="border-b">
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Source</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-right">Balance After</th>
                <th className="p-4 text-left">Order</th>
                <th className="p-4 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {historyLoading ? (
                <tr><td colSpan={7} className="p-10 text-center text-neutral-500">Loading reward history...</td></tr>
              ) : filteredHistory.length === 0 ? (
                <tr><td colSpan={7} className="p-10 text-center text-neutral-500">No reward history found.</td></tr>
              ) : filteredHistory.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0 hover:bg-neutral-50">
                  <td className="p-4">{time(row.createdAt) ? new Date(time(row.createdAt)).toLocaleString("en-IN") : "—"}</td>
                  <td className={`p-4 font-semibold ${row.type === "CREDIT" ? "text-emerald-700" : "text-red-700"}`}>{row.type}</td>
                  <td className="p-4">{row.source.replaceAll("_", " ")}</td>
                  <td className="p-4 text-right font-semibold">{row.type === "CREDIT" ? "+" : "-"}{Number(row.amount).toLocaleString("en-IN")} coins</td>
                  <td className="p-4 text-right">{row.balanceAfter == null ? "—" : `${Number(row.balanceAfter).toLocaleString("en-IN")} coins`}</td>
                  <td className="p-4">{row.orderId || "—"}</td>
                  <td className="p-4">{row.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
