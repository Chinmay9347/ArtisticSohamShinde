import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/server/firebase/admin";
export async function GET(request: Request) {
  try {
    const header=request.headers.get("authorization")??""; const token=header.startsWith("Bearer ")?header.slice(7):"";
    if(!token)return NextResponse.json({success:false,message:"Authentication required."},{status:401});
    const decoded=await adminAuth.verifyIdToken(token,true);
    const snap=await adminDb.collection("referrals").where("referrerUserId","==",decoded.uid).get();
    const referrals=snap.docs.map(d=>({id:d.id,...d.data()}));
    const ids=Array.from(new Set(referrals.map((r:any)=>String(r.referredUserId??"")).filter(Boolean)));
    const users=await Promise.all(ids.map(uid=>adminDb.collection("users").doc(uid).get()));
    const details=Object.fromEntries(users.filter(s=>s.exists).map(s=>[s.id,{uid:s.id,name:String(s.data()?.name??""),email:String(s.data()?.email??"")} ]));
    return NextResponse.json({success:true,referrals,users:details});
  }catch(error){return NextResponse.json({success:false,message:error instanceof Error?error.message:"Unable to load referrals."},{status:400});}
}
