import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/server/firebase/admin";

async function requireAdmin(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new Error("Authentication required.");
  const decoded = await adminAuth.verifyIdToken(token, true);
  const snap = await adminDb.collection("users").doc(decoded.uid).get();
  if (snap.data()?.role !== "ADMIN") throw new Error("Admin access required.");
  return decoded.uid;
}

function clean(body: any, id?: string) {
  const scope = ["PIN", "CITY", "STATE", "INDIA"].includes(body.scope) ? body.scope : "INDIA";
  const serviceLevel = body.serviceLevel === "EXPRESS" ? "EXPRESS" : "STANDARD";
  return {
    ...(id ? {} : {}),
    provider: String(body.provider ?? "").trim(),
    serviceLevel,
    scope,
    enabled: body.enabled !== false,
    priority: Math.floor(Number(body.priority ?? 0)),
    pincodes: Array.isArray(body.pincodes) ? body.pincodes.map(String).map((v:string)=>v.trim()).filter(Boolean) : [],
    pincodePrefixes: Array.isArray(body.pincodePrefixes) ? body.pincodePrefixes.map(String).map((v:string)=>v.trim()).filter(Boolean) : [],
    cities: Array.isArray(body.cities) ? body.cities.map(String).map((v:string)=>v.trim()).filter(Boolean) : [],
    states: Array.isArray(body.states) ? body.states.map(String).map((v:string)=>v.trim()).filter(Boolean) : [],
    country: "India",
    charge: Math.max(0, Math.round(Number(body.charge ?? 0))),
    freeDeliveryMinimumOrderValue: body.freeDeliveryMinimumOrderValue == null || body.freeDeliveryMinimumOrderValue === "" ? null : Math.max(0, Number(body.freeDeliveryMinimumOrderValue)),
    notes: String(body.notes ?? "").trim(),
    updatedAt: new Date(),
  };
}

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const snap = await adminDb.collection("deliveryRules").get();
    const rules = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    rules.sort((a:any,b:any) => String(a.provider).localeCompare(String(b.provider)) || String(a.serviceLevel).localeCompare(String(b.serviceLevel)) || Number(b.priority ?? 0) - Number(a.priority ?? 0));
    return NextResponse.json({ success: true, rules });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to load delivery rules." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const adminUid = await requireAdmin(request);
    const body = await request.json();
    const data = clean(body);
    if (!data.provider) return NextResponse.json({ success: false, message: "Courier/provider name is required." }, { status: 400 });
    const ref = adminDb.collection("deliveryRules").doc();
    await ref.set({ ...data, createdAt: new Date(), createdBy: adminUid });
    return NextResponse.json({ success: true, rule: { id: ref.id, ...data } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to create delivery rule." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const adminUid = await requireAdmin(request);
    const body = await request.json();
    const id = String(body.id ?? "").trim();
    if (!id) return NextResponse.json({ success: false, message: "Rule ID is required." }, { status: 400 });
    const ref = adminDb.collection("deliveryRules").doc(id);
    if (!(await ref.get()).exists) return NextResponse.json({ success: false, message: "Delivery rule not found." }, { status: 404 });
    const data = clean(body, id);
    if (!data.provider) return NextResponse.json({ success: false, message: "Courier/provider name is required." }, { status: 400 });
    await ref.update({ ...data, updatedBy: adminUid });
    return NextResponse.json({ success: true, rule: { id, ...data } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to update delivery rule." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const id = String(body.id ?? "").trim();
    if (!id) return NextResponse.json({ success: false, message: "Rule ID is required." }, { status: 400 });
    await adminDb.collection("deliveryRules").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to delete delivery rule." }, { status: 400 });
  }
}
