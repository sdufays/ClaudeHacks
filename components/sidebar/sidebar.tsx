import type { Profile } from "@/lib/types/shared";
import { ProfileChip } from "@/components/sidebar/profile-chip";
import { CouncilorsPanel } from "@/components/sidebar/councilors-panel";
import { UpcomingPanel } from "@/components/sidebar/upcoming-panel";
import { FeedbackStat } from "@/components/sidebar/feedback-stat";

interface SidebarProps {
  profile: Profile;
  reactionCount?: number;
}

export function Sidebar({ profile, reactionCount = 0 }: SidebarProps) {
  return (
    <aside className="space-y-4 w-full">
      <ProfileChip profile={profile} />
      <FeedbackStat reactionCount={reactionCount} />
      <UpcomingPanel />
      <CouncilorsPanel />
    </aside>
  );
}
