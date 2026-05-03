"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  CommuteMode,
  HousingStatus,
  IssueTag,
  Profile,
} from "@/lib/types/shared";
import { TOPIC_LABEL } from "@/lib/topics";
import { saveProfile } from "@/lib/profile-store";

const HOUSING_OPTIONS: { value: HousingStatus; label: string }[] = [
  { value: "rent", label: "Rent" },
  { value: "own", label: "Own" },
  { value: "other", label: "Other" },
];

const COMMUTE_OPTIONS: { value: CommuteMode; label: string }[] = [
  { value: "bike", label: "Bike" },
  { value: "transit", label: "Transit" },
  { value: "walk", label: "Walk" },
  { value: "drive", label: "Drive" },
  { value: "wfh", label: "Work from home" },
];

const NEIGHBORHOODS = [
  "Agassiz",
  "Area 2/MIT",
  "Cambridge Highlands",
  "Cambridgeport",
  "East Cambridge",
  "Inman Square",
  "Mid-Cambridge",
  "Neighborhood Nine",
  "North Cambridge",
  "Riverside",
  "Strawberry Hill",
  "The Port",
  "Wellington-Harrington",
  "West Cambridge",
];

const TOPIC_VALUES = Object.keys(TOPIC_LABEL) as IssueTag[];
const MAX_TOPICS = 5;

export function OnboardingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState(NEIGHBORHOODS[0]);
  const [housing, setHousing] = useState<HousingStatus>("rent");
  const [commute, setCommute] = useState<CommuteMode>("bike");
  const [topics, setTopics] = useState<IssueTag[]>(["housing", "transit"]);
  const [submitting, setSubmitting] = useState(false);

  function toggleTopic(t: IssueTag) {
    setTopics((cur) => {
      if (cur.includes(t)) return cur.filter((x) => x !== t);
      if (cur.length >= MAX_TOPICS) return cur;
      return [...cur, t];
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;
    setSubmitting(true);
    const profile: Profile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      address: address.trim(),
      neighborhood,
      housing,
      commute,
      issueTags: topics,
    };
    saveProfile(profile);
    router.push("/digest");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Field label="Your first name" required>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alex"
          required
          className="w-full rounded-2xl border border-muted-light/20 bg-card-white px-4 py-3 font-sans text-sm text-body-light placeholder:text-muted-light shadow-card-soft focus:outline-none focus:ring-2 focus:ring-accent-brand-light/40"
        />
      </Field>

      <Field label="Cambridge street address" required>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="23 Inman Street"
          required
          className="w-full rounded-2xl border border-muted-light/20 bg-card-white px-4 py-3 font-sans text-sm text-body-light placeholder:text-muted-light shadow-card-soft focus:outline-none focus:ring-2 focus:ring-accent-brand-light/40"
        />
      </Field>

      <Field label="Neighborhood">
        <select
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          className="w-full rounded-2xl border border-muted-light/20 bg-card-white px-4 py-3 font-sans text-sm text-body-light shadow-card-soft focus:outline-none focus:ring-2 focus:ring-accent-brand-light/40"
        >
          {NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Housing">
        <ChipGroup
          options={HOUSING_OPTIONS}
          value={housing}
          onChange={setHousing}
        />
      </Field>

      <Field label="Primary commute">
        <ChipGroup
          options={COMMUTE_OPTIONS}
          value={commute}
          onChange={setCommute}
        />
      </Field>

      <Field label={`Issues you care about (up to ${MAX_TOPICS})`}>
        <div className="flex flex-wrap gap-2">
          {TOPIC_VALUES.map((t) => {
            const selected = topics.includes(t);
            const disabled = !selected && topics.length >= MAX_TOPICS;
            return (
              <button
                type="button"
                key={t}
                onClick={() => toggleTopic(t)}
                disabled={disabled}
                className={`rounded-full px-3.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide transition-colors ${
                  selected
                    ? "bg-accent-brand-light text-white"
                    : "bg-card-white text-body-light border border-muted-light/25"
                } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {TOPIC_LABEL[t]}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="flex items-center justify-between gap-4 border-t border-muted-light/15 pt-6">
        <p className="font-sans text-xs text-muted-light max-w-md">
          By continuing you consent to your reactions being aggregated
          anonymously and shared with city council.
        </p>
        <button
          type="submit"
          disabled={submitting || !name.trim() || !address.trim()}
          className="shrink-0 rounded-2xl bg-accent-brand-light px-6 py-3 font-sans text-sm font-bold text-white shadow-card-soft transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "See my briefing"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-muted-light">
        {label}
        {required && <span className="ml-1 text-accent-brand-light">*</span>}
      </span>
      {children}
    </label>
  );
}

function ChipGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-2xl px-4 py-2 font-sans text-sm transition-colors ${
              selected
                ? "bg-accent-brand-light text-white font-bold"
                : "bg-card-white text-body-light border border-muted-light/25 cursor-pointer"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
