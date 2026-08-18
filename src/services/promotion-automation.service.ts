import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firestore";
import { getAllUsers } from "@/services/user";

export async function publishPromotionNotification(title:string,message:string,href="/commission",offerId?:string){
 const users=await getAllUsers();
 await Promise.all(users.filter((u:any)=>u.role==="CUSTOMER" && u.isActive!==false).map((user:any)=>addDoc(collection(db,"notifications"),{userId:user.uid,title,message,href,offerId:offerId??null,read:false,createdAt:serverTimestamp()})));
}
