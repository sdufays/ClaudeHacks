import type { Profile } from "@/lib/types/shared";
import { TopicPill } from "@/components/design/topic-pill";

const HOUSING_LABEL: Record<string, string> = {
  rent: "Renter",
  own: "Homeowner",
  other: "Other",
};

const COMMUTE_LABEL: Record<string, string> = {
  drive: "Drives",
  transit: "Takes transit",
  bike: "Bikes",
  walk: "Walks",
  wfh: "Works from home",
};

interface ProfileChipProps {
  profile: Profile;
}

export function ProfileChip({ profile }: ProfileChipProps) {
  return (
    <div className="rounded-card bg-card-white shadow-card-soft p-5 space-y-3">
      <div className="space-y-0.5">
        <p className="font-sans font-bold text-sm text-headline-light">{profile.name}</p>
        <p className="font-sans text-xs text-muted-light leading-snug">
          {profile.neighborhood ?? profile.address}
        </p>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-body-light">
        <span>{HOUSING_LABEL[profile.housing]}</span>
        <span>{COMMUTE_LABEL[profile.commute]}</span>
      </div>

      {profile.issueTags && profile.issueTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {profile.issueTags.map((tag) => (
            <TopicPill key={tag} topic={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
