"use client";

import { useMemo, useState } from "react";
import { upsertPricingConfig } from "@/services/pricing";
import type { PricingConfigDocument } from "@/types/pricing";
import type { PricingManagerProps } from "./PricingManager.types";

export function PricingManager({ initialConfigs }: PricingManagerProps) {
  const [configs, setConfigs] = useState<PricingConfigDocument[]>(initialConfigs);
  const [selectedId, setSelectedId] = useState(initialConfigs[0]?.packageId ?? "");
  const [mode, setMode] = useState<"discount" | "price">("discount");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [copyFrom, setCopyFrom] = useState<string>(initialConfigs[0]?.packageId ?? "");
  const [copyTo, setCopyTo] = useState<string>(initialConfigs[1]?.packageId ?? initialConfigs[0]?.packageId ?? "");

  const selected = useMemo(() => configs.find((c) => c.packageId === selectedId), [configs, selectedId]);
  const marketing = useMemo(() => {
    if (!selected) return { original: 0, discount: 0, discounted: 0 };
    const original = Number(selected.originalPrice ?? selected.prices.sketched);
    const discounted = Number(selected.prices.sketched);
    const discount = Number(selected.discountPercent ?? (original > 0 ? ((original-discounted)/original)*100 : 0));
    return { original, discount, discounted };
  }, [selected]);

  function updateSelected(updater: (config: PricingConfigDocument) => PricingConfigDocument) {
    setConfigs((current) => current.map((c) => c.packageId === selectedId ? updater(c) : c));
  }

  function setOriginal(value: string) {
    const original = Math.max(0, Number(value) || 0);
    updateSelected((c) => {
      const discount = Number(c.discountPercent ?? 0);
      const discounted = Math.round(original * (1 - discount / 100));
      return { ...c, originalPrice: original, discountPercent: discount, prices: { ...c.prices, sketched: discounted } };
    });
  }

  function setDiscount(value: string) {
    const discount = Math.min(100, Math.max(0, Number(value) || 0));
    updateSelected((c) => {
      const original = Number(c.originalPrice ?? c.prices.sketched);
      return { ...c, originalPrice: original, discountPercent: discount, prices: { ...c.prices, sketched: Math.round(original * (1-discount/100)) } };
    });
  }

  function setDiscounted(value: string) {
    const discounted = Math.max(0, Number(value) || 0);
    updateSelected((c) => {
      const original = Number(c.originalPrice ?? c.prices.sketched);
      const discount = original > 0 ? Math.min(100, Math.max(0, ((original-discounted)/original)*100)) : 0;
      return { ...c, originalPrice: original, discountPercent: Number(discount.toFixed(2)), prices: { ...c.prices, sketched: discounted } };
    });
  }

  function setPrice(field: "framed"|"digital"|"premiumFrame", value: string) {
    updateSelected((c) => ({ ...c, prices: { ...c.prices, [field]: Math.max(0, Number(value) || 0) } }));
  }

  function setAdditionalSubject(value: string) {
    const v = Math.max(0, Number(value) || 0);
    updateSelected((c) => ({ ...c, subjectPrices: {1:0,2:v,3:v*2,4:v*3} }));
  }

  async function save() {
    if (!selected || saving) return;
    setSaving(true); setMessage("");
    try {
      await upsertPricingConfig(selected.packageId, {
        packageId: selected.packageId, packageName: selected.packageName, size: selected.size, dimensions: selected.dimensions,
        originalPrice: Number(selected.originalPrice ?? selected.prices.sketched),
        discountPercent: Number(selected.discountPercent ?? 0), prices: selected.prices, subjectPrices: selected.subjectPrices, enabled: selected.enabled,
      });
      setMessage("Pricing changes saved successfully.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save pricing."); } finally { setSaving(false); }
  }

  function copyPricing() {
    const source = configs.find((c) => c.packageId === copyFrom);
    if (!source || copyFrom === copyTo) return;
    setConfigs((current) => current.map((c) => c.packageId === copyTo ? { ...c, originalPrice: source.originalPrice, discountPercent: source.discountPercent, prices: {...source.prices}, subjectPrices: {...source.subjectPrices} } : c));
    setSelectedId(copyTo as "classic" | "premium" | "luxury" | "royal"); setMessage(`Pricing copied from ${source.packageName}. Review and save the target package.`);
  }

  if (!selected) return <div className="rounded-2xl border bg-white p-8 text-neutral-500">No pricing configuration available.</div>;
  return (
    <div className="space-y-8">
      <section><h1 className="font-cinzel text-4xl font-bold">Pricing Management</h1><p className="mt-3 text-neutral-600">Manage A5 → A4 → A3 → A2 pricing. Original price, discount and discounted price stay synchronized.</p></section>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{configs.map((config) => <button key={config.packageId} type="button" onClick={() => {setSelectedId(config.packageId);setMessage("");}} className={`rounded-2xl border p-5 text-left transition ${config.packageId===selectedId ? "border-[#C9A227] bg-[#C9A227]/10" : "bg-white hover:border-[#C9A227]/50"}`}><div className="font-semibold">{config.packageName}</div><div className="mt-1 text-sm text-neutral-500">{config.size} · ₹{Number(config.prices.sketched).toLocaleString("en-IN")}</div></button>)}</section>

      <section className="rounded-3xl border bg-white p-7 shadow-sm space-y-6">
        <div><h2 className="text-xl font-semibold">Customer-facing price</h2><p className="mt-1 text-sm text-neutral-500">Enter either Discount % or Discounted Price. The other field is automatically calculated and disabled.</p></div>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Original Price (₹)"><input type="number" min="0" value={marketing.original} onChange={(e)=>setOriginal(e.target.value)} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#C9A227]" /></Field>
          <Field label="Discount (%)"><input type="number" min="0" max="100" step="0.01" value={marketing.discount.toFixed(2)} disabled={mode!=="discount"} onChange={(e)=>setDiscount(e.target.value)} className={`w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#C9A227] ${mode!=="discount"?"bg-neutral-100 text-neutral-400":""}`} /><button type="button" onClick={()=>setMode("discount")} className="mt-2 text-xs font-semibold text-[#8f7414]">Use Discount %</button></Field>
          <Field label="Discounted Price (₹)"><input type="number" min="0" value={marketing.discounted} disabled={mode!=="price"} onChange={(e)=>setDiscounted(e.target.value)} className={`w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#C9A227] ${mode!=="price"?"bg-neutral-100 text-neutral-400":""}`} /><button type="button" onClick={()=>setMode("price")} className="mt-2 text-xs font-semibold text-[#8f7414]">Use Discounted Price</button></Field>
        </div>
        <div className="rounded-2xl border border-[#C9A227]/30 bg-[#C9A227]/5 p-5"><p className="text-sm text-neutral-500">Customer preview</p><div className="mt-2 flex flex-wrap items-baseline gap-3"><span className="text-sm text-neutral-500 line-through">₹{marketing.original.toLocaleString("en-IN")}</span><span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">{marketing.discount.toFixed(2).replace(/\.00$/,"")}% OFF</span><strong className="text-3xl">₹{marketing.discounted.toLocaleString("en-IN")}</strong></div></div>
      </section>

      <section className="rounded-3xl border bg-white p-7 shadow-sm"><h2 className="text-xl font-semibold">Fulfillment & subjects</h2><div className="mt-5 grid gap-5 md:grid-cols-4">
        <Field label="Framed Price (₹)"><input type="number" min="0" value={selected.prices.framed} onChange={(e)=>setPrice("framed",e.target.value)} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#C9A227]" /></Field>
        <Field label="Digital Price (₹)"><input type="number" min="0" value={selected.prices.digital} onChange={(e)=>setPrice("digital",e.target.value)} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#C9A227]" /></Field>
        <Field label="Premium Frame (₹)"><input type="number" min="0" value={selected.prices.premiumFrame} onChange={(e)=>setPrice("premiumFrame",e.target.value)} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#C9A227]" /></Field>
        <Field label="Extra Subject (₹)"><input type="number" min="0" value={selected.subjectPrices[2]} onChange={(e)=>setAdditionalSubject(e.target.value)} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#C9A227]" /></Field>
      </div></section>

      <section className="rounded-3xl border bg-white p-7 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Package availability</h2><p className="mt-1 text-sm text-neutral-500">Disabled packages are hidden from public pricing.</p></div><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={selected.enabled} onChange={(e)=>updateSelected(c=>({...c,enabled:e.target.checked}))} /> Enabled</label></div></section>

      <section className="rounded-3xl border bg-white p-7 shadow-sm"><h2 className="text-xl font-semibold">Copy Pricing</h2><div className="mt-5 grid gap-4 md:grid-cols-3"><select value={copyFrom} onChange={(e)=>setCopyFrom(e.target.value)} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#C9A227]">{configs.map(c=><option key={c.packageId} value={c.packageId}>{c.packageName} ({c.size})</option>)}</select><select value={copyTo} onChange={(e)=>setCopyTo(e.target.value)} className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-[#C9A227]">{configs.map(c=><option key={c.packageId} value={c.packageId}>{c.packageName} ({c.size})</option>)}</select><button type="button" onClick={copyPricing} className="rounded-xl border px-5 py-3 font-semibold hover:bg-neutral-50">Copy Pricing</button></div></section>

      {message && <div className="rounded-2xl border bg-neutral-50 p-4 text-sm">{message}</div>}
      <button type="button" onClick={()=>void save()} disabled={saving} className="rounded-xl bg-[#C9A227] px-7 py-3 font-semibold text-black disabled:opacity-50">{saving?"Saving...":"Save Changes"}</button>
    </div>
  );
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="block"><span className="mb-2 block text-sm font-medium text-neutral-700">{label}</span>{children}</label>}
