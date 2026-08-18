"use client";

import { useUserProfile } from "@/hooks/useUserProfile";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning ☀️";
  if (hour < 18) return "Good Afternoon 🌤️";

  return "Good Evening 🌙";
}

export function WelcomeCard() {
  const { profile, loading } =
    useUserProfile();

  if (loading) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        Loading...
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">

      <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#C9A227]">
        Welcome Back
      </p>

      <h2 className="mt-3 font-heading text-4xl font-bold text-zinc-900">
        {getGreeting()},
        {" "}
        {profile?.name ?? "Customer"} 👋
      </h2>

      <p className="mt-4 text-lg text-zinc-600">
        Turning Memories into Timeless Art.
      </p>

      <p className="mt-2 max-w-2xl text-zinc-500">
        Welcome to your personal dashboard.
        From here you can manage commissions,
        track orders, update your profile,
        and stay informed about every stage
        of your artwork.
      </p>

    </section>
  );
}

// "use client";

// import { useAuth } from "@/context/AuthContext";

// function getGreeting() {
//   const hour = new Date().getHours();

//   if (hour < 12) return "Good Morning ☀️";
//   if (hour < 18) return "Good Afternoon 🌤️";
//   return "Good Evening 🌙";
// }

// export function WelcomeCard() {
//   const { user } = useAuth();

//   return (
//     <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
//       <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#C9A227]">
//         Welcome Back
//       </p>

//       <h2 className="mt-3 font-heading text-4xl font-bold text-zinc-900">
//         {getGreeting()},
//         {" "}
//         {user?.displayName ?? "Guest"} 👋
//       </h2>

//       <p className="mt-4 text-lg text-zinc-600">
//         Turning Memories into Timeless Art.
//       </p>

//       <p className="mt-2 max-w-2xl text-zinc-500">
//         Welcome to your personal dashboard. From here you can
//         manage commissions, track orders, update your profile,
//         and stay informed about every stage of your artwork.
//       </p>
//     </section>
//   );
// }