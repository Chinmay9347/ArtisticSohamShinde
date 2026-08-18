import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"; import { db } from "@/firebase/firestore";
export async function getSiteContent<T>(key:string,fallback:T):Promise<T>{const snap=await getDoc(doc(db,"siteContent",key));return snap.exists()?({ ...fallback as object, ...snap.data() } as T):fallback;}
export async function saveSiteContent(key:string,data:Record<string,unknown>){return setDoc(doc(db,"siteContent",key),{...data,updatedAt:serverTimestamp()},{merge:true});}
