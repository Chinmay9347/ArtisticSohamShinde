"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";

import { useUserProfile } from "@/hooks/useUserProfile";

import { buildDashboardHero } from "./DashboardHero.helpers";

import { dashboardHeroStyles as styles } from "./DashboardHero.styles";

export function DashboardHero() {
  const { profile, loading } =
    useUserProfile();

  if (loading || !profile) {
    return (
      <section className={styles.wrapper}>
        Loading...
      </section>
    );
  }

  const hero = buildDashboardHero({
    name: profile.name.split(" ")[0],

    firstLoginCompleted:
      profile.firstLoginCompleted,
  });

  return (
    <section className={styles.wrapper}>
        <div className={styles.decoration} />

        <div className={styles.decoration2} />

      <p className={styles.badge}>
        {hero.title}
      </p>

      <h1 className={styles.heading}>
        {hero.heading}
      </h1>

      <p className={styles.description}>
        {hero.description}
      </p>

      <div className={styles.divider} />

      <div className={styles.buttonWrapper}>

        <Link href={hero.primaryHref}>
          <Button size="lg">
            {hero.primaryLabel}
          </Button>
        </Link>

        <Link href={hero.secondaryHref}>
          <Button
            variant="outline"
            size="lg"
          >
            {hero.secondaryLabel}
          </Button>
        </Link>

      </div>

    </section>
  );
}