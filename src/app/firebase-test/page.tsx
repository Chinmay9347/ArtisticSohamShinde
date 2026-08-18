"use client";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";
import { storage } from "@/firebase/storage";

export default function FirebaseTestPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black text-white">
      <h1 className="text-4xl font-bold">
        Firebase Connected ✅
      </h1>

      <div className="space-y-2 text-center">
        <p>
          Auth:
          <span className="ml-2 text-green-400">
            {auth ? "Connected" : "Failed"}
          </span>
        </p>

        <p>
          Firestore:
          <span className="ml-2 text-green-400">
            {db ? "Connected" : "Failed"}
          </span>
        </p>

        <p>
          Storage:
          <span className="ml-2 text-green-400">
            {storage ? "Connected" : "Failed"}
          </span>
        </p>
      </div>
    </main>
  );
}