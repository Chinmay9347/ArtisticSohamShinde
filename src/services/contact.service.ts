import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firestore";
export interface ContactMessage { id:string; name:string; email:string; phone?:string; subject:string; message:string; status?:"NEW"|"READ"|"REPLIED"; createdAt?:unknown; }
export async function createContactMessage(data: Omit<ContactMessage,"id"|"createdAt"|"status">){ return addDoc(collection(db,"contactMessages"),{...data,status:"NEW",createdAt:serverTimestamp()}); }
export async function getContactMessages(){const snap=await getDocs(query(collection(db,"contactMessages"),orderBy("createdAt","desc")));return snap.docs.map(d=>({id:d.id,...d.data()})) as ContactMessage[];}
export async function updateContactMessageStatus(id:string,status:ContactMessage["status"]){return updateDoc(doc(db,"contactMessages",id),{status,updatedAt:serverTimestamp()});}
