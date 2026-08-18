"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Edit3, Plus, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type Rule = {
  id: string;
  provider: string;
  serviceLevel: "STANDARD" | "EXPRESS";
  scope: "PIN" | "CITY" | "STATE" | "INDIA";
  enabled?: boolean;
  priority?: number;
  pincodes?: string[];
  pincodePrefixes?: string[];
  cities?: string[];
  states?: string[];
  charge: number;
  freeDeliveryMinimumOrderValue?: number | null;
  notes?: string;
};

const empty: Omit<Rule, "id"> = { provider: "", serviceLevel: "STANDARD", scope: "PIN", enabled: true, priority: 0, pincodes: [], pincodePrefixes: [], cities: [], states: [], charge: 0, freeDeliveryMinimumOrderValue: null, notes: "" };

export default function DeliveryPricingPage() {
  const { user } = useAuth();
  const [rules, setRules] = useState<Rule[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [service, setService] = useState("ALL");
  const [sort, setSort] = useState("PROVIDER");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = await user?.getIdToken(true);
    return fetch(url, { ...options, headers: { "Content-Type": "application/json", ...(options.headers ?? {}), Authorization: `Bearer ${token ?? ""}` } });
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/admin/delivery/rules");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Unable to load delivery rules.");
      setRules(data.rules ?? []);
    } catch (e) { setMessage(e instanceof Error ? e.message : "Unable to load delivery rules."); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) void load(); }, [user]);

  const filtered = useMemo(() => rules.filter(r => {
    const q = search.trim().toLowerCase();
    const text = [r.provider, ...(r.pincodes ?? []), ...(r.pincodePrefixes ?? []), ...(r.cities ?? []), ...(r.states ?? [])].join(" ").toLowerCase();
    return (!q || text.includes(q)) && (service === "ALL" || r.serviceLevel === service);
  }).sort((a,b) => sort === "CHARGE" ? a.charge - b.charge : sort === "PRIORITY" ? Number(b.priority ?? 0) - Number(a.priority ?? 0) : a.provider.localeCompare(b.provider)), [rules, search, service, sort]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setMessage("");
    const payload = { ...form, pincodes: form.pincodes ?? [], pincodePrefixes: form.pincodePrefixes ?? [], cities: form.cities ?? [], states: form.states ?? [] };
    try {
      const res = await authFetch("/api/admin/delivery/rules", { method: editing ? "PUT" : "POST", body: JSON.stringify(editing ? { ...payload, id: editing } : payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Unable to save rule.");
      setForm(empty); setEditing(null); await load(); setMessage("Delivery rule saved.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Unable to save rule."); }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this delivery pricing rule? This can change future pricing calculations.")) return;
    const res = await authFetch("/api/admin/delivery/rules", { method: "DELETE", body: JSON.stringify({ id }) });
    const data = await res.json();
    if (!res.ok) setMessage(data.message ?? "Unable to delete rule."); else await load();
  };

  const edit = (r: Rule) => { setEditing(r.id); setForm({ provider: r.provider, serviceLevel: r.serviceLevel, scope: r.scope, enabled: r.enabled !== false, priority: r.priority ?? 0, pincodes: r.pincodes ?? [], pincodePrefixes: r.pincodePrefixes ?? [], cities: r.cities ?? [], states: r.states ?? [], charge: r.charge, freeDeliveryMinimumOrderValue: r.freeDeliveryMinimumOrderValue ?? null, notes: r.notes ?? "" }); };
  const listValue = (key: "pincodes" | "pincodePrefixes" | "cities" | "states") => (form[key] ?? []).join(", ");
  const setList = (key: "pincodes" | "pincodePrefixes" | "cities" | "states", value: string) => setForm(f => ({ ...f, [key]: value.split(",").map(v => v.trim()).filter(Boolean) }));

  return <main className="mx-auto max-w-7xl space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><Link href="/admin/shipping" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black"><ArrowLeft size={16}/> Shipping</Link><p className="mt-4 text-sm uppercase tracking-[0.3em] text-[#C9A227]">Administration</p><h1 className="mt-2 font-cinzel text-4xl">Courier Pricing</h1><p className="mt-2 max-w-3xl text-sm text-neutral-500">Save courier rates by PIN, city, state or India-wide coverage. Matching providers are compared at pricing time and the lowest configured quote is selected.</p></div><div className="rounded-2xl bg-[#C9A227]/10 p-4 text-[#C9A227]"><Truck/></div></div>
    <section className="rounded-3xl border bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Add / edit courier rate</h2><p className="mt-1 text-sm text-neutral-500">Use comma-separated values for PINs, cities and states.</p></div>{editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="rounded-xl border px-4 py-2 text-sm">Cancel edit</button>}</div>
      <form onSubmit={save} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input required placeholder="Courier / provider" value={form.provider} onChange={e=>setForm(f=>({...f,provider:e.target.value}))} className="rounded-xl border px-4 py-3"/>
        <select value={form.serviceLevel} onChange={e=>setForm(f=>({...f,serviceLevel:e.target.value as Rule["serviceLevel"]}))} className="rounded-xl border px-4 py-3"><option value="STANDARD">Standard</option><option value="EXPRESS">Express</option></select>
        <select value={form.scope} onChange={e=>setForm(f=>({...f,scope:e.target.value as Rule["scope"]}))} className="rounded-xl border px-4 py-3"><option value="PIN">Exact PIN / Prefix</option><option value="CITY">City</option><option value="STATE">State</option><option value="INDIA">All India</option></select>
        <input type="number" min="0" placeholder="Charge ₹" value={form.charge} onChange={e=>setForm(f=>({...f,charge:Number(e.target.value)}))} className="rounded-xl border px-4 py-3"/>
        <input type="number" min="0" placeholder="Free delivery above ₹ (optional)" value={form.freeDeliveryMinimumOrderValue ?? ""} onChange={e=>setForm(f=>({...f,freeDeliveryMinimumOrderValue:e.target.value === "" ? null : Number(e.target.value)}))} className="rounded-xl border px-4 py-3"/>
        <input type="number" placeholder="Priority" value={form.priority ?? 0} onChange={e=>setForm(f=>({...f,priority:Number(e.target.value)}))} className="rounded-xl border px-4 py-3"/>
        {form.scope === "PIN" && <><input placeholder="PIN codes: 415002, 411001" value={listValue("pincodes")} onChange={e=>setList("pincodes",e.target.value)} className="rounded-xl border px-4 py-3"/><input placeholder="PIN prefixes: 415, 411" value={listValue("pincodePrefixes")} onChange={e=>setList("pincodePrefixes",e.target.value)} className="rounded-xl border px-4 py-3"/></>}
        {form.scope === "CITY" && <input placeholder="Cities: Satara, Pune" value={listValue("cities")} onChange={e=>setList("cities",e.target.value)} className="rounded-xl border px-4 py-3"/>}
        {form.scope === "STATE" && <input placeholder="States: Maharashtra, Karnataka" value={listValue("states")} onChange={e=>setList("states",e.target.value)} className="rounded-xl border px-4 py-3"/>}
        <input placeholder="Notes / courier conditions" value={form.notes ?? ""} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} className="rounded-xl border px-4 py-3 md:col-span-2"/>
        <label className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"><input type="checkbox" checked={form.enabled !== false} onChange={e=>setForm(f=>({...f,enabled:e.target.checked}))}/> Active rule</label>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 font-semibold text-black"><Plus size={18}/>{editing ? "Update rate" : "Save rate"}</button>
      </form>
      {message && <p className="mt-4 rounded-xl bg-neutral-50 p-3 text-sm text-neutral-600">{message}</p>}
    </section>
    <section className="rounded-3xl border bg-white shadow-sm"><div className="border-b p-6"><div className="flex flex-wrap items-end gap-3"><div className="min-w-[220px] flex-1"><label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Search</label><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Provider, PIN, city, state" className="mt-2 w-full rounded-xl border px-4 py-3"/></div><div><label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Service</label><select value={service} onChange={e=>setService(e.target.value)} className="mt-2 rounded-xl border px-4 py-3"><option value="ALL">All</option><option value="STANDARD">Standard</option><option value="EXPRESS">Express</option></select></div><div><label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Sort</label><select value={sort} onChange={e=>setSort(e.target.value)} className="mt-2 rounded-xl border px-4 py-3"><option value="PROVIDER">Provider</option><option value="CHARGE">Lowest charge</option><option value="PRIORITY">Priority</option></select></div></div></div>
      {loading ? <p className="p-8 text-sm text-neutral-500">Loading rates...</p> : filtered.length === 0 ? <p className="p-8 text-sm text-neutral-500">No courier rates saved.</p> : <div className="overflow-x-auto"><table className="min-w-[950px] w-full text-sm"><thead className="bg-neutral-50"><tr><th className="p-4 text-left">Provider</th><th className="p-4 text-left">Service</th><th className="p-4 text-left">Coverage</th><th className="p-4 text-right">Charge</th><th className="p-4 text-right">Free above</th><th className="p-4 text-left">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y">{filtered.map(r=><tr key={r.id}><td className="p-4 font-semibold">{r.provider}</td><td className="p-4">{r.serviceLevel}</td><td className="p-4">{r.scope === "PIN" ? [...(r.pincodes ?? []), ...(r.pincodePrefixes ?? []).map(v=>`${v}*`)].join(", ") || "—" : r.scope === "CITY" ? (r.cities ?? []).join(", ") : r.scope === "STATE" ? (r.states ?? []).join(", ") : "All India"}</td><td className="p-4 text-right">₹{r.charge.toLocaleString("en-IN")}</td><td className="p-4 text-right">{r.freeDeliveryMinimumOrderValue == null ? "—" : `₹${Number(r.freeDeliveryMinimumOrderValue).toLocaleString("en-IN")}`}</td><td className="p-4">{r.enabled === false ? "Disabled" : "Active"}</td><td className="p-4"><div className="flex justify-end gap-2"><button onClick={()=>edit(r)} className="rounded-lg border p-2" aria-label="Edit"><Edit3 size={16}/></button><button onClick={()=>void remove(r.id)} className="rounded-lg border p-2 text-red-600" aria-label="Delete"><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>}
    </section>
  </main>;
}
