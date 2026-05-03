"use client";

import { Sidebar } from "@/components/sidebar/sidebar";
import { useProfile } from "@/lib/profile-store";

export function SidebarClient({ reactionCount }: { reactionCount?: number }) {
  const { profile } = useProfile();
  return <Sidebar profile={profile} reactionCount={reactionCount} />;
}
