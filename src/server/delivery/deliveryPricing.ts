import { adminDb } from "@/server/firebase/admin";

export type DeliveryServiceLevel = "STANDARD" | "EXPRESS";
export type DeliveryRuleScope = "PIN" | "CITY" | "STATE" | "INDIA";

export type DeliveryRule = {
  id: string;
  provider: string;
  serviceLevel: DeliveryServiceLevel;
  scope: DeliveryRuleScope;
  enabled?: boolean;
  priority?: number;
  pincodes?: string[];
  pincodePrefixes?: string[];
  cities?: string[];
  states?: string[];
  country?: string;
  charge: number;
  freeDeliveryMinimumOrderValue?: number | null;
  notes?: string;
  updatedAt?: unknown;
};

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function parseEnvRules(): DeliveryRule[] {
  const raw = String(process.env.DELIVERY_RULES_JSON ?? "").trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((rule): rule is DeliveryRule =>
      rule && typeof rule === "object" &&
      typeof rule.id === "string" &&
      typeof rule.provider === "string" &&
      (rule.serviceLevel === "STANDARD" || rule.serviceLevel === "EXPRESS") &&
      Number.isFinite(Number(rule.charge)),
    );
  } catch {
    throw new Error("DELIVERY_RULES_JSON is not valid JSON.");
  }
}

async function loadRules(): Promise<DeliveryRule[]> {
  try {
    const snapshot = await adminDb.collection("deliveryRules").get();
    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<DeliveryRule, "id">),
      }));
    }
  } catch (error) {
    console.warn("Delivery rules Firestore lookup failed; using environment rules.", error);
  }
  return parseEnvRules();
}

function matches(rule: DeliveryRule, address: { city: string; state: string; pincode: string; country: string }) {
  if (rule.enabled === false) return false;
  if (rule.country && normalize(rule.country) !== normalize(address.country)) return false;

  const scope = rule.scope ?? (
    (rule.pincodes?.length || rule.pincodePrefixes?.length) ? "PIN" :
    rule.cities?.length ? "CITY" :
    rule.states?.length ? "STATE" : "INDIA"
  );

  if (scope === "PIN") {
    const exact = (rule.pincodes ?? []).map((v) => String(v).trim());
    const prefixes = (rule.pincodePrefixes ?? []).map((v) => String(v).trim());
    return exact.includes(address.pincode) || prefixes.some((prefix) => address.pincode.startsWith(prefix));
  }
  if (scope === "CITY") return (rule.cities ?? []).some((city) => normalize(city) === normalize(address.city));
  if (scope === "STATE") return (rule.states ?? []).some((state) => normalize(state) === normalize(address.state));
  return normalize(address.country) === "india";
}

function scopeScore(scope: DeliveryRuleScope) {
  return ({ PIN: 400, CITY: 300, STATE: 200, INDIA: 100 } as Record<DeliveryRuleScope, number>)[scope] ?? 100;
}

export async function getDeliveryQuotes(address: {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}, options?: { orderValue?: number; serviceLevel?: DeliveryServiceLevel }) {
  if (normalize(address.country) !== "india") {
    throw new Error("Delivery is currently available only within India.");
  }
  const pincode = String(address.pincode ?? "").trim();
  if (!/^\d{6}$/.test(pincode)) throw new Error("Please enter a valid 6-digit Indian PIN code.");

  const requestedLevel = options?.serviceLevel ?? (process.env.DELIVERY_DEFAULT_SERVICE_LEVEL === "EXPRESS" ? "EXPRESS" : "STANDARD");
  const orderValue = Math.max(0, Number(options?.orderValue ?? 0));
  const rules = (await loadRules()).filter((rule) => rule.serviceLevel === requestedLevel && matches(rule, { ...address, pincode }));

  const bestByProvider = new Map<string, { rule: DeliveryRule; charge: number; freeDelivery: boolean; scope: DeliveryRuleScope }>();
  for (const rule of rules) {
    const scope = rule.scope ?? "INDIA";
    const threshold = rule.freeDeliveryMinimumOrderValue == null ? null : Math.max(0, Number(rule.freeDeliveryMinimumOrderValue));
    const freeDelivery = threshold != null && orderValue >= threshold;
    const charge = freeDelivery ? 0 : Math.max(0, Math.round(Number(rule.charge)));
    const current = bestByProvider.get(normalize(rule.provider));
    const candidate = { rule, charge, freeDelivery, scope };
    if (!current || scopeScore(scope) > scopeScore(current.scope) || (scopeScore(scope) === scopeScore(current.scope) && charge < current.charge) || (scopeScore(scope) === scopeScore(current.scope) && charge === current.charge && Number(rule.priority ?? 0) > Number(current.rule.priority ?? 0))) {
      bestByProvider.set(normalize(rule.provider), candidate);
    }
  }

  return Array.from(bestByProvider.values())
    .sort((a, b) => a.charge - b.charge || scopeScore(b.scope) - scopeScore(a.scope) || Number(b.rule.priority ?? 0) - Number(a.rule.priority ?? 0))
    .map(({ rule, charge, freeDelivery, scope }) => ({
      configured: true,
      serviceLevel: rule.serviceLevel,
      provider: rule.provider,
      ruleId: rule.id,
      zone: scope,
      deliveryCharge: charge,
      freeDelivery,
      freeDeliveryMinimumOrderValue: rule.freeDeliveryMinimumOrderValue == null ? null : Number(rule.freeDeliveryMinimumOrderValue),
      notes: rule.notes ?? null,
    }));
}

export async function calculateDeliveryQuote(address: {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}, options?: { orderValue?: number; serviceLevel?: DeliveryServiceLevel }) {
  const quotes = await getDeliveryQuotes(address, options);
  const selected = quotes[0];
  if (!selected) {
    return {
      configured: false,
      serviceLevel: options?.serviceLevel ?? (process.env.DELIVERY_DEFAULT_SERVICE_LEVEL === "EXPRESS" ? "EXPRESS" : "STANDARD"),
      provider: null,
      ruleId: null,
      zone: "UNCONFIGURED",
      deliveryCharge: 0,
      freeDelivery: false,
      alternatives: [],
    };
  }
  return { ...selected, alternatives: quotes.slice(1) };
}
