import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/server/firebase/admin";

export async function POST(request: Request) {
 try {
  const header=request.headers.get("authorization")??"";
  const token=header.startsWith("Bearer ")?header.slice(7):"";
  if(!token) return NextResponse.json({success:false,message:"Authentication required."},{status:401});
  const decoded=await adminAuth.verifyIdToken(token,true);
  const {referralCode}=await request.json() as {referralCode?:string};
  const code=referralCode?.trim().toUpperCase();
  if(!code) return NextResponse.json({success:false,message:"Referral code is required."},{status:400});
  const snap=await adminDb.collection("referrals").where("referralCode","==",code).limit(1).get();
  if(snap.empty) return NextResponse.json({success:false,message:"Referral code not found."},{status:404});
  const ref=snap.docs[0]; const data=ref.data();
  if(data.referrerUserId===decoded.uid) return NextResponse.json({success:false,message:"You cannot use your own referral code."},{status:400});
  const userSnapshot = await adminDb.collection("users").doc(decoded.uid).get();
  const existingReferralId = String(userSnapshot.data()?.referredByReferralId ?? "");
  if(existingReferralId && existingReferralId !== ref.id) return NextResponse.json({success:false,message:"This account is already linked to a referral."},{status:409});
  if(data.referredUserId&&data.referredUserId!==decoded.uid) return NextResponse.json({success:false,message:"This referral code has already been claimed."},{status:409});
  if(data.status!=="PENDING"&&data.status!=="ACTIVE") return NextResponse.json({success:false,message:"This referral code is no longer available."},{status:409});
  const campaignSnap=await adminDb.collection("referralCampaigns").doc(String(data.campaignId??"")).get();
  if(!campaignSnap.exists || campaignSnap.data()?.enabled!==true) return NextResponse.json({success:false,message:"This referral program is not currently active."},{status:409});
  const campaign=campaignSnap.data()!; const now=Date.now();
  const start=campaign.startAt?.toDate?.()?.getTime?.() ?? (campaign.startAt?new Date(campaign.startAt).getTime():0);
  const end=campaign.endAt?.toDate?.()?.getTime?.() ?? (campaign.endAt?new Date(campaign.endAt).getTime():0);
  if(start && now<start) return NextResponse.json({success:false,message:"This referral campaign has not started yet."},{status:409});
  if(end && now>end) return NextResponse.json({success:false,message:"This referral campaign has expired."},{status:409});
  await ref.ref.update({referredUserId:decoded.uid,status:"ACTIVE",updatedAt:new Date()});
  await adminDb.collection("users").doc(decoded.uid).set({referredByReferralCode:code,referredByReferralId:ref.id,updatedAt:new Date()},{merge:true});
  return NextResponse.json({success:true,referralId:ref.id,referralCode:code});
 } catch(error) { console.error("Referral claim error:",error); return NextResponse.json({success:false,message:error instanceof Error?error.message:"Unable to claim referral."},{status:400}); }
}
