import { DashboardHeroData } from "./DashboardHero.types";

interface DashboardHeroHelperProps {
  name: string;
  firstLoginCompleted: boolean;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return {
      title: "WELCOME BACK",
      heading: "☀️ Good Morning",
      description:
        "We're glad to see you again.",
    };
  }

  if (hour < 18) {
    return {
      title: "WELCOME BACK",
      heading: "🌤 Good Afternoon",
      description:
        "Here's what's happening with your artwork today.",
    };
  }

  return {
    title: "WELCOME BACK",
    heading: "🌙 Good Evening",
    description:
      "Welcome back to your dashboard.",
  };
}

export function buildDashboardHero({
  name,
  firstLoginCompleted,
}: DashboardHeroHelperProps): DashboardHeroData {
  if (!firstLoginCompleted) {
    return {
      title: "WELCOME",

      heading: `✨ Welcome to Artistic Soham, ${name}!`,

      description:
        "We're delighted to have you here.\n\nYour dashboard is ready. From here you can commission custom pencil portraits, track your artwork, manage your profile, and preserve your memories through timeless art.",

      primaryLabel: "🎨 Start Commission",

      primaryHref: "/commission",

      secondaryLabel: "🖼 Explore Gallery",

      secondaryHref: "/gallery",
    };
  }

  const greeting = getGreeting();

  return {
    title: greeting.title,

    heading: `${greeting.heading}, ${name}!`,

    description: greeting.description,

    primaryLabel: "📦 View Orders",

    primaryHref: "/orders",

    secondaryLabel: "🖼 Gallery",

    secondaryHref: "/gallery",
  };
}