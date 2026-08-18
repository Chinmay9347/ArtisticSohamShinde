"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, History, MinusCircle } from "lucide-react";
import { getAllUsers, updateUserRole } from "@/services/user";
import { getReferrals } from "@/services/referrals";
import type { ReferralDocument } from "@/types/referral";
import { TablePagination } from "@/components/shared/TablePagination";
import { useAuth } from "@/context/AuthContext";

interface UserRow {
  uid: string;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  referralRewardCoins?: number;
  referralRewardCoinsSpent?: number;
  referralRewardsEarned?: number;
}

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [referrals, setReferrals] = useState<ReferralDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { user: adminUser } = useAuth();

  const [searchDraft, setSearchDraft] = useState("");
  const [roleDraft, setRoleDraft] = useState("ALL");
  const [statusDraft, setStatusDraft] = useState("ALL");
  const [sortDraft, setSortDraft] = useState("NAME_ASC");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NAME_ASC");

  const [rewardUid, setRewardUid] = useState<string | null>(null);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardNote, setRewardNote] = useState("");
  const [removeUid, setRemoveUid] = useState<string | null>(null);
  const [removeAmount, setRemoveAmount] = useState(0);
  const [removeNote, setRemoveNote] = useState("");
  const [removeStep, setRemoveStep] = useState<1 | 2>(1);
  const [removeConfirmed, setRemoveConfirmed] = useState(false);

  // Every high-impact admin mutation uses the same two-step confirmation:
  // review the target/change first, then explicitly confirm it.
  const [grantStep, setGrantStep] = useState<1 | 2>(1);
  const [grantConfirmed, setGrantConfirmed] = useState(false);
  const [roleChange, setRoleChange] = useState<{
    uid: string;
    role: "CUSTOMER" | "ARTIST" | "ADMIN";
  } | null>(null);
  const [roleStep, setRoleStep] = useState<1 | 2>(1);
  const [roleConfirmed, setRoleConfirmed] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [userItems, referralItems] = await Promise.all([
        getAllUsers(),
        getReferrals().catch(() => []),
      ]);
      setUsers(userItems as UserRow[]);
      setReferrals(referralItems);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const rows = users.filter((u) => {
      const haystack = `${u.name ?? ""} ${u.email ?? ""} ${u.role ?? ""} ${u.uid}`.toLowerCase();
      return (
        (!search || haystack.includes(search.toLowerCase())) &&
        (roleFilter === "ALL" || (u.role ?? "CUSTOMER") === roleFilter) &&
        (statusFilter === "ALL" ||
          (statusFilter === "ACTIVE" ? u.isActive !== false : u.isActive === false))
      );
    });

    return rows.sort((a, b) => {
      if (sortBy === "WALLET_DESC") return Number(b.referralRewardCoins ?? 0) - Number(a.referralRewardCoins ?? 0);
      if (sortBy === "WALLET_ASC") return Number(a.referralRewardCoins ?? 0) - Number(b.referralRewardCoins ?? 0);
      if (sortBy === "EMAIL_ASC") return (a.email ?? "").localeCompare(b.email ?? "");
      if (sortBy === "EMAIL_DESC") return (b.email ?? "").localeCompare(a.email ?? "");
      if (sortBy === "NAME_DESC") return (b.name ?? b.email ?? "").localeCompare(a.name ?? a.email ?? "");
      return (a.name ?? a.email ?? "").localeCompare(b.name ?? b.email ?? "");
    });
  }, [users, search, roleFilter, statusFilter, sortBy]);

  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const applyFilter = () => {
    setSearch(searchDraft);
    setRoleFilter(roleDraft);
    setStatusFilter(statusDraft);
    setSortBy(sortDraft);
    setPage(1);
  };

  const grant = async () => {
    if (!adminUser || !rewardUid || rewardAmount <= 0 || !grantConfirmed) return;

    try {
      const token = await adminUser.getIdToken();
      const response = await fetch("/api/admin/rewards/grant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: rewardUid,
          amount: rewardAmount,
          note: rewardNote,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Grant failed.");

      setMessage(`Grant successful. New wallet: ${data.balance} coins.`);
      closeGrant();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Grant failed.");
    }
  };

  const closeGrant = () => {
    setRewardUid(null);
    setRewardAmount(0);
    setRewardNote("");
    setGrantStep(1);
    setGrantConfirmed(false);
  };

  const confirmRoleChange = async () => {
    if (!adminUser || !roleChange || !roleConfirmed) return;

    const target = users.find((u) => u.uid === roleChange.uid);
    if (!target) return;

    try {
      await updateUserRole(roleChange.uid, roleChange.role);
      setMessage(`Role changed to ${roleChange.role} for ${target.name || target.email || target.uid}.`);
      setRoleChange(null);
      setRoleStep(1);
      setRoleConfirmed(false);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to change user role.");
    }
  };

  const removeUserRewards = async () => {
    if (!adminUser || !removeUid || removeAmount <= 0 || !removeConfirmed) return;

    try {
      const token = await adminUser.getIdToken();
      const response = await fetch("/api/admin/rewards/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ uid: removeUid, amount: removeAmount, note: removeNote }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Reward removal failed.");
      setMessage(`Removed ${removeAmount} coins successfully. New wallet: ${data.balance} coins.`);
      closeRemove();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Reward removal failed.");
    }
  };

  const closeRemove = () => {
    setRemoveUid(null);
    setRemoveAmount(0);
    setRemoveNote("");
    setRemoveStep(1);
    setRemoveConfirmed(false);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">
          Administration
        </p>
        <h1 className="mt-2 font-cinzel text-4xl">Users & Artists</h1>
        <p className="mt-3 text-neutral-600">
          Live user data, referral relationships and unlimited admin reward grants.
        </p>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ArrowUpDown size={16} /> Sort / Filter
          </div>
          <label className="min-w-[240px] flex-1 space-y-1 text-xs">
            <span className="block text-neutral-500">Search</span>
            <input
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Name, email or UID"
              className="w-full rounded-xl border px-4 py-2 text-sm"
            />
          </label>
          <label className="space-y-1 text-xs">
            <span className="block text-neutral-500">Role</span>
            <select value={roleDraft} onChange={(e) => setRoleDraft(e.target.value)} className="rounded-xl border px-4 py-2 text-sm">
              <option value="ALL">All roles</option>
              <option value="CUSTOMER">Customer</option>
              <option value="ARTIST">Artist</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <label className="space-y-1 text-xs">
            <span className="block text-neutral-500">Status</span>
            <select value={statusDraft} onChange={(e) => setStatusDraft(e.target.value)} className="rounded-xl border px-4 py-2 text-sm">
              <option value="ALL">All status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
          <label className="space-y-1 text-xs">
            <span className="block text-neutral-500">Sort</span>
            <select value={sortDraft} onChange={(e) => setSortDraft(e.target.value)} className="rounded-xl border px-4 py-2 text-sm">
              <option value="NAME_ASC">Name A–Z</option>
              <option value="NAME_DESC">Name Z–A</option>
              <option value="EMAIL_ASC">Email A–Z</option>
              <option value="EMAIL_DESC">Email Z–A</option>
              <option value="WALLET_DESC">Wallet high → low</option>
              <option value="WALLET_ASC">Wallet low → high</option>
            </select>
          </label>
          <button type="button" onClick={applyFilter} className="w-full rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white sm:w-auto">
            Apply Filter
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-neutral-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] whitespace-nowrap text-sm">
              <thead className="bg-neutral-50">
                <tr className="border-b">
                  <th className="p-4 text-left">Sr. No.</th>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Reward Wallet</th>
                  <th className="p-4 text-left">Referral</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((u, index) => {
                  const hasReferrals = referrals.some(
                    (r) => r.referrerUserId === u.uid && Boolean(r.referredUserId),
                  );

                  return (
                    <tr key={u.uid} className="border-b last:border-b-0 hover:bg-neutral-50">
                      <td className="p-4">{(page - 1) * pageSize + index + 1}</td>
                      <td className="p-4">
                        <p className="font-semibold">{u.name || "Unnamed User"}</p>
                        <p className="text-sm text-neutral-500">{u.email || "—"}</p>
                        <p className="mt-1 text-xs text-neutral-400">{u.uid}</p>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role || "CUSTOMER"}
                          onChange={(e) => {
                            const nextRole = e.target.value as "CUSTOMER" | "ARTIST" | "ADMIN";
                            const currentRole = (u.role || "CUSTOMER") as "CUSTOMER" | "ARTIST" | "ADMIN";
                            if (nextRole === currentRole) return;
                            setRoleChange({ uid: u.uid, role: nextRole });
                            setRoleStep(1);
                            setRoleConfirmed(false);
                          }}
                          className="rounded-xl border px-3 py-2 text-sm"
                        >
                          <option value="CUSTOMER">Customer</option>
                          <option value="ARTIST">Artist</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="p-4">{u.isActive === false ? "Inactive" : "Active"}</td>
                      <td className="p-4 text-right font-semibold text-[#8f7414]">
                        {Number(u.referralRewardCoins ?? 0).toLocaleString("en-IN")} coins
                      </td>
                      <td className="p-4">
                        {hasReferrals ? (
                          <Link
                            href={`/admin/referrals/referred/${u.uid}`}
                            className="rounded-xl border px-4 py-2 text-sm font-semibold hover:border-[#C9A227]"
                          >
                            View Referrals
                          </Link>
                        ) : (
                          <span className="text-neutral-400">No used code</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Link
                            href={`/admin/customers/${u.uid}/rewards`}
                            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold hover:border-[#C9A227]"
                          >
                            <History size={15} /> History
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setRewardUid(u.uid);
                              setRewardAmount(0);
                              setRewardNote("");
                              setGrantStep(1);
                              setGrantConfirmed(false);
                            }}
                            className="rounded-xl bg-[#C9A227] px-3 py-2 text-sm font-semibold text-black"
                          >
                            Grant Unlimited
                          </button>
                          <button
                            type="button"
                            disabled={Number(u.referralRewardCoins ?? 0) <= 0}
                            onClick={() => {
                              setRemoveUid(u.uid);
                              setRemoveAmount(0);
                              setRemoveNote("");
                              setRemoveStep(1);
                              setRemoveConfirmed(false);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <MinusCircle size={15} /> Remove Coins
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!visible.length && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-neutral-500">
                      No users match the applied filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <TablePagination
            page={page}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </section>

      {message && <p className="rounded-xl border bg-white p-4 text-sm">{message}</p>}

      {rewardUid && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeGrant();
          }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
            {grantStep === 1 ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8f7414]">Step 1 of 2 · Review</p>
                <h2 className="mt-2 text-2xl font-semibold">Grant reward coins</h2>
                <p className="mt-2 text-sm text-neutral-500">Review the account, amount and reason before continuing. Admin grants are unlimited and directly change the customer wallet.</p>
                <div className="mt-5 rounded-2xl bg-neutral-50 p-4 text-sm">
                  <p><span className="text-neutral-500">User:</span> <strong>{users.find((u) => u.uid === rewardUid)?.name || users.find((u) => u.uid === rewardUid)?.email || rewardUid}</strong></p>
                  <p className="mt-2"><span className="text-neutral-500">Current wallet:</span> <strong>{Number(users.find((u) => u.uid === rewardUid)?.referralRewardCoins ?? 0).toLocaleString("en-IN")} coins</strong></p>
                </div>
                <label className="mt-5 block text-sm font-medium">Coins to add
                  <input type="number" min="1" value={rewardAmount || ""} onChange={(e) => setRewardAmount(Math.max(0, Math.floor(Number(e.target.value) || 0)))} className="mt-2 w-full rounded-xl border px-4 py-3" placeholder="Enter exact amount" />
                </label>
                <label className="mt-3 block text-sm font-medium">Reason / note
                  <input value={rewardNote} onChange={(e) => setRewardNote(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" placeholder="Why are these coins being added?" />
                </label>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={closeGrant} className="rounded-xl border px-4 py-2">Cancel</button>
                  <button type="button" disabled={!rewardAmount} onClick={() => setGrantStep(2)} className="rounded-xl bg-black px-5 py-2 font-semibold text-white disabled:opacity-40">Continue</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-700">Step 2 of 2 · Final confirmation</p>
                <h2 className="mt-2 text-2xl font-semibold">Confirm reward grant</h2>
                <p className="mt-3 text-sm text-neutral-600">You are about to add <strong>{rewardAmount} coins</strong> to <strong>{users.find((u) => u.uid === rewardUid)?.name || users.find((u) => u.uid === rewardUid)?.email || rewardUid}</strong>.</p>
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">This changes the wallet immediately and creates an ADMIN_GRANT entry in reward history.</div>
                <label className="mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm">
                  <input type="checkbox" checked={grantConfirmed} onChange={(e) => setGrantConfirmed(e.target.checked)} className="mt-1" />
                  <span>I confirm that I intentionally want to add exactly <strong>{rewardAmount} coins</strong> to this account.</span>
                </label>
                <div className="mt-6 flex justify-between gap-3">
                  <button type="button" onClick={() => { setGrantStep(1); setGrantConfirmed(false); }} className="rounded-xl border px-4 py-2">Back</button>
                  <div className="flex gap-3">
                    <button type="button" onClick={closeGrant} className="rounded-xl border px-4 py-2">Cancel</button>
                    <button type="button" disabled={!grantConfirmed || !adminUser} onClick={() => void grant()} className="rounded-xl bg-black px-5 py-2 font-semibold text-white disabled:opacity-40">Grant Reward</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {roleChange && (
        <div
          className="fixed inset-0 z-[105] flex items-center justify-center bg-black/60 p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setRoleChange(null);
              setRoleStep(1);
              setRoleConfirmed(false);
            }
          }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
            {roleStep === 1 ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8f7414]">Step 1 of 2 · Review</p>
                <h2 className="mt-2 text-2xl font-semibold">Assign user role</h2>
                <p className="mt-2 text-sm text-neutral-500">Role changes can immediately change the areas and permissions available to this account.</p>
                <div className="mt-5 rounded-2xl bg-neutral-50 p-4 text-sm">
                  <p><span className="text-neutral-500">User:</span> <strong>{users.find((u) => u.uid === roleChange.uid)?.name || users.find((u) => u.uid === roleChange.uid)?.email || roleChange.uid}</strong></p>
                  <p className="mt-2"><span className="text-neutral-500">Current role:</span> <strong>{users.find((u) => u.uid === roleChange.uid)?.role || "CUSTOMER"}</strong></p>
                  <p className="mt-2"><span className="text-neutral-500">New role:</span> <strong>{roleChange.role}</strong></p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => { setRoleChange(null); setRoleStep(1); setRoleConfirmed(false); }} className="rounded-xl border px-4 py-2">Cancel</button>
                  <button type="button" onClick={() => setRoleStep(2)} className="rounded-xl bg-black px-5 py-2 font-semibold text-white">Continue</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-700">Step 2 of 2 · Final confirmation</p>
                <h2 className="mt-2 text-2xl font-semibold">Confirm role assignment</h2>
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">You are changing this account from <strong>{users.find((u) => u.uid === roleChange.uid)?.role || "CUSTOMER"}</strong> to <strong>{roleChange.role}</strong>. This may change dashboard access and permissions immediately.</div>
                <label className="mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm">
                  <input type="checkbox" checked={roleConfirmed} onChange={(e) => setRoleConfirmed(e.target.checked)} className="mt-1" />
                  <span>I confirm that the selected user and new role are correct.</span>
                </label>
                <div className="mt-6 flex justify-between gap-3">
                  <button type="button" onClick={() => { setRoleStep(1); setRoleConfirmed(false); }} className="rounded-xl border px-4 py-2">Back</button>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setRoleChange(null); setRoleStep(1); setRoleConfirmed(false); }} className="rounded-xl border px-4 py-2">Cancel</button>
                    <button type="button" disabled={!roleConfirmed || !adminUser} onClick={() => void confirmRoleChange()} className="rounded-xl bg-red-700 px-5 py-2 font-semibold text-white disabled:opacity-40">Assign Role</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {removeUid && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-5"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeRemove(); }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
            {removeStep === 1 ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-700">Step 1 of 2 · Review</p>
                <h2 className="mt-2 text-2xl font-semibold">Remove reward coins</h2>
                <p className="mt-2 text-sm text-neutral-500">This permanently reduces the selected user&apos;s reward wallet. Review the amount before continuing.</p>
                <div className="mt-5 rounded-2xl bg-neutral-50 p-4 text-sm">
                  <p><span className="text-neutral-500">User:</span> <strong>{users.find((u) => u.uid === removeUid)?.name || users.find((u) => u.uid === removeUid)?.email || removeUid}</strong></p>
                  <p className="mt-2"><span className="text-neutral-500">Current wallet:</span> <strong>{Number(users.find((u) => u.uid === removeUid)?.referralRewardCoins ?? 0).toLocaleString("en-IN")} coins</strong></p>
                </div>
                <label className="mt-5 block text-sm font-medium">Coins to remove<input type="number" min="1" max={Number(users.find((u) => u.uid === removeUid)?.referralRewardCoins ?? 0)} value={removeAmount || ""} onChange={(e) => setRemoveAmount(Math.max(0, Math.floor(Number(e.target.value) || 0)))} className="mt-2 w-full rounded-xl border px-4 py-3" placeholder="Enter exact amount" /></label>
                <label className="mt-3 block text-sm font-medium">Reason / note<input value={removeNote} onChange={(e) => setRemoveNote(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" placeholder="Why are these coins being removed?" /></label>
                <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={closeRemove} className="rounded-xl border px-4 py-2">Cancel</button><button type="button" disabled={!removeAmount || removeAmount > Number(users.find((u) => u.uid === removeUid)?.referralRewardCoins ?? 0)} onClick={() => setRemoveStep(2)} className="rounded-xl bg-black px-5 py-2 font-semibold text-white disabled:opacity-40">Continue</button></div>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-700">Step 2 of 2 · Final confirmation</p>
                <h2 className="mt-2 text-2xl font-semibold">Confirm reward removal</h2>
                <p className="mt-3 text-sm text-neutral-600">You are about to remove <strong>{removeAmount} coins</strong> from <strong>{users.find((u) => u.uid === removeUid)?.name || users.find((u) => u.uid === removeUid)?.email || removeUid}</strong>.</p>
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">This action changes the wallet and creates an ADMIN_REMOVE entry in the reward history. Make sure the user and amount are correct.</div>
                <label className="mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm"><input type="checkbox" checked={removeConfirmed} onChange={(e) => setRemoveConfirmed(e.target.checked)} className="mt-1" /><span>I confirm that I intentionally want to remove exactly <strong>{removeAmount} coins</strong> from this account.</span></label>
                <div className="mt-6 flex justify-between gap-3"><button type="button" onClick={() => { setRemoveStep(1); setRemoveConfirmed(false); }} className="rounded-xl border px-4 py-2">Back</button><div className="flex gap-3"><button type="button" onClick={closeRemove} className="rounded-xl border px-4 py-2">Cancel</button><button type="button" disabled={!removeConfirmed || !adminUser} onClick={() => void removeUserRewards()} className="rounded-xl bg-red-700 px-5 py-2 font-semibold text-white disabled:opacity-40">Remove Coins</button></div></div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
