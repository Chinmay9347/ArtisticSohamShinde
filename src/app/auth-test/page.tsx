"use client";

import { useAuth } from "@/context/AuthContext";

export default function AuthTestPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black text-white">
      <h1 className="text-4xl font-bold">
        Authentication Test
      </h1>

      {user ? (
        <>
          <p>✅ Logged In</p>

          <p>{user.email}</p>
        </>
      ) : (
        <p>❌ Not Logged In</p>
      )}
    </main>
  );
}