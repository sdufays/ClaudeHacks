"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProfile } from "@/lib/profile-store";

export function LandingCta() {
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    setHasProfile(loadProfile() !== null);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={hasProfile ? "/digest" : "/onboarding"}
        className="rounded-2xl bg-accent-brand-light px-6 py-3 font-sans text-sm font-bold text-white shadow-card-soft transition-opacity hover:opacity-90"
      >
        {hasProfile ? "See your briefing" : "Get started — 30 seconds"}
      </Link>
      {hasProfile && (
        <Link
          href="/onboarding"
          className="font-sans text-sm text-muted-light hover:text-body-light"
        >
          Edit your profile
        </Link>
      )}
    </div>
  );
}
