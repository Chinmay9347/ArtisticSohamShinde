"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { createReferralCampaign, getReferralCampaigns, getReferrals, updateReferralCampaign } from "@/services/referrals";
import { getAllUsers } from "@/services/user";
import type { ReferralCampaignDocument, ReferralCampaignFormData, ReferralDocument } from "@/types/referral";

const initialForm: ReferralCampaignFormData = {
  name: "",
  codePrefix: "AS",
  enabled: true,
  referredCustomerReward: { type: "PERCENTAGE", value: 10, maximumDiscount: null, minimumOrderValue: null },
  referrerReward: { type: "FIXED", value: 100, maximumDiscount: null, minimumOrderValue: null },
  firstOrderOnly: true,
  stackWithOffers: false,
  startAt: null,
  endAt: null,
  rewardValidityDays: 90,
};

export default function AdminReferralsPage() {
  const [campaigns, setCampaigns] = useState<ReferralCampaignDocument[]>([]);
  const [form, setForm] = useState<ReferralCampaignFormData>(initialForm);
  const [message, setMessage] = useState("");
  const [referrals, setReferrals] = useState<ReferralDocument[]>([]);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<Record<string, { name?: string; email?: string }>>({});

  const usedReferrals = referrals.filter((referral) => Boolean(referral.referredUserId));
  const referrerGroups = useMemo(() => {
    const ids = Array.from(new Set(usedReferrals.map((referral) => referral.referrerUserId)));
    return ids.map((uid) => ({
      uid,
      referrals: usedReferrals.filter((referral) => referral.referrerUserId === uid),
    }));
  }, [referrals]);

  // const load = async () => {
  //   const [campaignItems, referralItems, userItems] = await Promise.all([getReferralCampaigns(), getReferrals(), getAllUsers()]);
  //   setCampaigns(campaignItems);
  //   setReferrals(referralItems);
  //   setUsers(Object.fromEntries(userItems.map((item) => [item.uid, { name: String(item.name ?? ""), email: String(item.email ?? "") }])));
  // };
  const load = async () => {
    const [campaignItems, referralItems, userItems] = await Promise.all([
      getReferralCampaigns(),
      getReferrals(),
      getAllUsers(),
    ]);

    setCampaigns(campaignItems);
    setReferrals(referralItems);

    const usersWithDetails = userItems as Array<{
      uid: string;
      name?: unknown;
      email?: unknown;
    }>;

    setUsers(
      Object.fromEntries(
        usersWithDetails.map((item) => [
          item.uid,
          {
            name: String(item.name ?? ""),
            email: String(item.email ?? ""),
          },
        ])
      )
    );
  };
  useEffect(() => { load().catch(() => setMessage("Unable to load referral campaigns.")); }, []);

  const updateReward = (which: "referredCustomerReward" | "referrerReward", field: "type" | "value" | "maximumDiscount" | "minimumOrderValue", value: string | number | null) => {
    setForm((current) => ({ ...current, [which]: { ...current[which], [field]: value } }));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.codePrefix.trim()) { setMessage("Campaign name and code prefix are required."); return; }
    if (form.referredCustomerReward.type === "PERCENTAGE" && (form.referredCustomerReward.value < 0 || form.referredCustomerReward.value > 100)) { setMessage("Customer referral percentage must be 0–100%."); return; }
    if (form.referrerReward.type === "PERCENTAGE" && (form.referrerReward.value < 0 || form.referrerReward.value > 100)) { setMessage("Referrer reward percentage must be 0–100%."); return; }
    if (form.rewardValidityDays < 60 || form.rewardValidityDays > 90) { setMessage("Reward validity must be between 60 and 90 days."); return; }
    try {
      setSaving(true);
      await createReferralCampaign({
        ...form,
        codePrefix: form.codePrefix.trim().toUpperCase(),
        startAt: form.startAt ? new Date(String(form.startAt)) : null,
        endAt: form.endAt ? new Date(String(form.endAt)) : null,
      });
      setForm(initialForm);
      await load();
      setMessage("Referral campaign created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create campaign.");
    } finally { setSaving(false); }
  };

  const toggle = async (campaign: ReferralCampaignDocument) => {
    await updateReferralCampaign(campaign.id, { enabled: !campaign.enabled });
    await load();
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Administration</p>
        <h1 className="mt-2 font-cinzel text-4xl">Referral Campaigns</h1>
        <p className="mt-3 text-neutral-600">Control referral discounts and rewards separately from customer coupons.</p>
      </section>

      <form onSubmit={save} className="rounded-3xl border bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold">Create Campaign</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Campaign Name"><input className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-[#C9A227]" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Launch Referral" /></Field>
          <Field label="Code Prefix"><input className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-[#C9A227]" value={form.codePrefix} onChange={(e) => setForm({ ...form, codePrefix: e.target.value.toUpperCase() })} placeholder="AS" /></Field>
          <RewardFields title="Referred Customer Reward" reward={form.referredCustomerReward} update={(field, value) => updateReward("referredCustomerReward", field, value)} />
          <RewardFields title="Referrer Reward" reward={form.referrerReward} update={(field, value) => updateReward("referrerReward", field, value)} />
          <Field label="Reward validity (days)">
            <input type="number" min="60" max="90" value={form.rewardValidityDays} onChange={(e) => setForm({ ...form, rewardValidityDays: Number(e.target.value) })} className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3" />
            <span className="text-xs text-neutral-500">Allowed window: 60–90 days (2–3 months).</span>
          </Field>
        </div>
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.firstOrderOnly} onChange={(e) => setForm({ ...form, firstOrderOnly: e.target.checked })} /> Referred customer discount: first order only</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.stackWithOffers} onChange={(e) => setForm({ ...form, stackWithOffers: e.target.checked })} /> Stack with coupons</label>
        </div>
        {message && <p className="mt-5 text-sm text-neutral-600">{message}</p>}
        <button disabled={saving} className="mt-6 rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black disabled:opacity-50">{saving ? "Creating..." : "Create Campaign"}</button>
      </form>

      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6"><h2 className="text-xl font-semibold">Existing Campaigns</h2></div>
        <div className="divide-y">
          {campaigns.length === 0 ? <p className="p-6 text-neutral-500">No campaigns created yet.</p> : campaigns.map((campaign) => (
            <div key={campaign.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div><div className="flex items-center gap-3"><strong>{campaign.name}</strong><span className="text-sm text-neutral-500">{campaign.codePrefix}</span></div><p className="mt-1 text-sm text-neutral-500">Customer: {campaign.referredCustomerReward.value}{campaign.referredCustomerReward.type === "PERCENTAGE" ? "%" : " INR"} · Referrer: {campaign.referrerReward.value}{campaign.referrerReward.type === "PERCENTAGE" ? "%" : " INR"}</p></div>
              <button onClick={() => toggle(campaign)} className="rounded-xl border px-4 py-2 text-sm">{campaign.enabled ? "Disable" : "Enable"}</button>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Referrers & Used Referral Codes</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Exactly one card is shown per user whose referral code has actually been used. Users with only unused codes are hidden.
          </p>
        </div>
        <div className="divide-y">
          {referrerGroups.length === 0 ? (
            <p className="p-6 text-neutral-500">No referral code has been used yet.</p>
          ) : (
            referrerGroups.map(({ uid, referrals: group }) => {
              const person = users[uid];
              const qualified = group.filter((r) => r.status === "QUALIFIED" || r.status === "REWARDED").length;
              return (
                <div key={uid} className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{person?.name || person?.email || uid}</p>
                    <p className="text-sm text-neutral-500">{person?.email || uid}</p>
                    <p className="mt-2 text-xs text-neutral-400">
                      {group.length} referred user{group.length === 1 ? "" : "s"} · {qualified} qualified/rewarded
                    </p>
                  </div>
                  <Link
                    href={`/admin/referrals/referred/${uid}`}
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#C9A227] hover:text-black"
                  >
                    View Referred Users
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </section>

    </main>
  );
}

function RewardFields({ title, reward, update }: { title: string; reward: ReferralCampaignFormData["referredCustomerReward"]; update: (field: "type" | "value" | "maximumDiscount" | "minimumOrderValue", value: string | number | null) => void }) {
  const input = "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-[#C9A227]";
  return (
    <div className="rounded-2xl border p-5">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm"><span>Type</span><select className={input} value={reward.type} onChange={(e) => update("type", e.target.value)}><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed INR</option></select></label>
        <label className="space-y-2 text-sm"><span>Value</span><input className={input} type="number" min="0" max={reward.type === "PERCENTAGE" ? 100 : undefined} value={reward.value} onChange={(e) => update("value", Number(e.target.value))} /></label>
        <label className="space-y-2 text-sm"><span>Maximum Discount</span><input className={input} type="number" min="0" value={reward.maximumDiscount ?? ""} onChange={(e) => update("maximumDiscount", e.target.value === "" ? null : Number(e.target.value))} /></label>
        <label className="space-y-2 text-sm"><span>Minimum Order</span><input className={input} type="number" min="0" value={reward.minimumOrderValue ?? ""} onChange={(e) => update("minimumOrderValue", e.target.value === "" ? null : Number(e.target.value))} /></label>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="space-y-2"><span className="block text-sm font-medium text-neutral-700">{label}</span>{children}</label>; }
