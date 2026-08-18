import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/firebase/auth";

export interface LoginData {
  email: string;
  password: string;
}

export async function loginUser({
  email,
  password,
}: LoginData) {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  await credential.user.reload();

  return credential.user;
}