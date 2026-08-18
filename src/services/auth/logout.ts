import { signOut } from "firebase/auth";

import { auth } from "@/firebase/auth";

export async function logoutUser() {
  await signOut(auth);
}