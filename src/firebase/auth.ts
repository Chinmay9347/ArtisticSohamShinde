import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);

// Keep Firebase Auth persistent across normal browser refreshes and
// Next.js client navigation. A network failure must never be treated
// as a logout.
void setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Unable to enable local Firebase Auth persistence:", error);
});
