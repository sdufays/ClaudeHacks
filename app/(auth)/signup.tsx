import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Eyebrow } from '@/components/design';
import { colors, fonts, spacing, radius, shadows } from '@/lib/theme';
import { TOPIC_LABEL, TOPIC_COLORS } from '@/lib/topics';
import type { IssueTag } from '@/lib/types/shared';
import { setSignedIn } from '@/lib/session';

// ─────────────────────────────────────────────────────────────────────────────
// Field option lists — kept in sync with user-profile.md
// ─────────────────────────────────────────────────────────────────────────────

type HousingStatus = 'rent' | 'own' | 'other';
type CommuteMode = 'drive' | 'transit' | 'bike' | 'walk' | 'mixed' | 'wfh' | 'na';
type Composition =
  | 'solo' | 'couple' | 'parent_k12' | 'parent_under5'
  | 'multigen' | 'roommates' | 'other';
type YearsInCambridge = '<1' | '1-5' | '5-15' | '15+' | 'lifelong' | 'pnts';
type AgeBracket = '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65-74' | '75+' | 'pnts';
type Gender = 'woman' | 'man' | 'nonbinary' | 'self' | 'pnts';
type RaceEthnicity =
  | 'aian' | 'asian' | 'black' | 'hispanic' | 'mena'
  | 'nhpi' | 'white' | 'self' | 'pnts';
type IncomeBracket =
  | '<25' | '25-50' | '50-75' | '75-100' | '100-150' | '150-250' | '250+' | 'pnts';
type Language =
  | 'english' | 'spanish' | 'portuguese' | 'haitian_creole'
  | 'mandarin' | 'cantonese' | 'bengali' | 'amharic' | 'other' | 'pnts';
type VoterStatus = 'yes' | 'no' | 'not_eligible' | 'pnts';

const HOUSING_OPTIONS: { value: HousingStatus; label: string }[] = [
  { value: 'rent', label: 'Rent' },
  { value: 'own', label: 'Own' },
  { value: 'other', label: 'Other' },
];

const COMMUTE_OPTIONS: { value: CommuteMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'drive', label: 'Drive', icon: 'car-outline' },
  { value: 'transit', label: 'Transit', icon: 'subway-outline' },
  { value: 'bike', label: 'Bike', icon: 'bicycle-outline' },
  { value: 'walk', label: 'Walk', icon: 'walk-outline' },
  { value: 'mixed', label: 'Mixed', icon: 'shuffle-outline' },
  { value: 'wfh', label: 'WFH', icon: 'home-outline' },
  { value: 'na', label: 'N/A', icon: 'remove-outline' },
];

const COMPOSITION_OPTIONS: { value: Composition; label: string }[] = [
  { value: 'solo', label: 'Solo' },
  { value: 'couple', label: 'Couple' },
  { value: 'parent_k12', label: 'Parent (K–12)' },
  { value: 'parent_under5', label: 'Parent (under 5)' },
  { value: 'multigen', label: 'Multi-generational' },
  { value: 'roommates', label: 'Roommates' },
  { value: 'other', label: 'Other' },
];

const YEARS_OPTIONS: { value: YearsInCambridge; label: string }[] = [
  { value: '<1', label: '< 1 year' },
  { value: '1-5', label: '1–5' },
  { value: '5-15', label: '5–15' },
  { value: '15+', label: '15+' },
  { value: 'lifelong', label: 'Lifelong' },
  { value: 'pnts', label: 'Prefer not to say' },
];

const AGE_OPTIONS: { value: AgeBracket; label: string }[] = [
  { value: '18-24', label: '18–24' },
  { value: '25-34', label: '25–34' },
  { value: '35-44', label: '35–44' },
  { value: '45-54', label: '45–54' },
  { value: '55-64', label: '55–64' },
  { value: '65-74', label: '65–74' },
  { value: '75+', label: '75+' },
  { value: 'pnts', label: 'Prefer not to say' },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'woman', label: 'Woman' },
  { value: 'man', label: 'Man' },
  { value: 'nonbinary', label: 'Non-binary' },
  { value: 'self', label: 'Self-describe' },
  { value: 'pnts', label: 'Prefer not to say' },
];

const RACE_OPTIONS: { value: RaceEthnicity; label: string }[] = [
  { value: 'aian', label: 'American Indian / Alaska Native' },
  { value: 'asian', label: 'Asian' },
  { value: 'black', label: 'Black or African American' },
  { value: 'hispanic', label: 'Hispanic or Latino/a/e' },
  { value: 'mena', label: 'Middle Eastern / North African' },
  { value: 'nhpi', label: 'Native Hawaiian / Pacific Islander' },
  { value: 'white', label: 'White' },
  { value: 'self', label: 'Self-describe' },
  { value: 'pnts', label: 'Prefer not to say' },
];

const INCOME_OPTIONS: { value: IncomeBracket; label: string }[] = [
  { value: '<25', label: '< $25k' },
  { value: '25-50', label: '$25–50k' },
  { value: '50-75', label: '$50–75k' },
  { value: '75-100', label: '$75–100k' },
  { value: '100-150', label: '$100–150k' },
  { value: '150-250', label: '$150–250k' },
  { value: '250+', label: '$250k+' },
  { value: 'pnts', label: 'Prefer not to say' },
];

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'haitian_creole', label: 'Haitian Creole' },
  { value: 'mandarin', label: 'Mandarin' },
  { value: 'cantonese', label: 'Cantonese' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'amharic', label: 'Amharic' },
  { value: 'other', label: 'Other' },
  { value: 'pnts', label: 'Prefer not to say' },
];

const VOTER_OPTIONS: { value: VoterStatus; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_eligible', label: 'Not eligible' },
  { value: 'pnts', label: 'Prefer not to say' },
];

const TOPIC_KEYS = Object.keys(TOPIC_LABEL) as IssueTag[];
const MAX_TOPICS = 5;

// ─────────────────────────────────────────────────────────────────────────────

export default function SignupScreen() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 — required
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [unit, setUnit] = useState('');
  const [housing, setHousing] = useState<HousingStatus | null>(null);
  const [commute, setCommute] = useState<CommuteMode | null>(null);
  const [consentSentiment, setConsentSentiment] = useState(false);
  const [consentNeighborhood, setConsentNeighborhood] = useState(false);
  const [consentRetention, setConsentRetention] = useState(false);
  const [consentEmailDigest, setConsentEmailDigest] = useState(false);

  // Step 2 — helpful
  const [composition, setComposition] = useState<Composition | null>(null);
  const [topics, setTopics] = useState<IssueTag[]>([]);
  const [yearsInCambridge, setYearsInCambridge] = useState<YearsInCambridge | null>(null);

  // Step 3 — optional demographics
  const [ageBracket, setAgeBracket] = useState<AgeBracket | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [raceEthnicity, setRaceEthnicity] = useState<RaceEthnicity[]>([]);
  const [incomeBracket, setIncomeBracket] = useState<IncomeBracket | null>(null);
  const [primaryLanguage, setPrimaryLanguage] = useState<Language | null>(null);
  const [voterRegistered, setVoterRegistered] = useState<VoterStatus | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const step1Valid =
    email.trim().includes('@') &&
    displayName.trim().length > 0 &&
    streetAddress.trim().length > 0 &&
    housing !== null &&
    commute !== null &&
    consentSentiment &&
    consentNeighborhood &&
    consentRetention;

  const finish = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSignedIn(true);
      router.replace('/');
    }, 700);
  };

  const toggleTopic = (t: IssueTag) => {
    setTopics((cur) => {
      if (cur.includes(t)) return cur.filter((x) => x !== t);
      if (cur.length >= MAX_TOPICS) return cur;
      return [...cur, t];
    });
  };

  const toggleRace = (r: RaceEthnicity) => {
    setRaceEthnicity((cur) => {
      // "Prefer not to say" is exclusive
      if (r === 'pnts') return cur.includes('pnts') ? [] : ['pnts'];
      const next = cur.filter((x) => x !== 'pnts');
      return next.includes(r) ? next.filter((x) => x !== r) : [...next, r];
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.glow, styles.glowTopLeft]} />
      <View style={[styles.glow, styles.glowBottomRight]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Progress step={step} />

          {step === 1 ? (
            <Step1
              {...{
                email, setEmail,
                displayName, setDisplayName,
                streetAddress, setStreetAddress,
                unit, setUnit,
                housing, setHousing,
                commute, setCommute,
                consentSentiment, setConsentSentiment,
                consentNeighborhood, setConsentNeighborhood,
                consentRetention, setConsentRetention,
                consentEmailDigest, setConsentEmailDigest,
              }}
            />
          ) : null}

          {step === 2 ? (
            <Step2
              composition={composition}
              setComposition={setComposition}
              topics={topics}
              toggleTopic={toggleTopic}
              yearsInCambridge={yearsInCambridge}
              setYearsInCambridge={setYearsInCambridge}
            />
          ) : null}

          {step === 3 ? (
            <Step3
              ageBracket={ageBracket}
              setAgeBracket={setAgeBracket}
              gender={gender}
              setGender={setGender}
              raceEthnicity={raceEthnicity}
              toggleRace={toggleRace}
              incomeBracket={incomeBracket}
              setIncomeBracket={setIncomeBracket}
              primaryLanguage={primaryLanguage}
              setPrimaryLanguage={setPrimaryLanguage}
              voterRegistered={voterRegistered}
              setVoterRegistered={setVoterRegistered}
            />
          ) : null}

          {/* Step actions */}
          <View style={styles.actions}>
            {step === 1 ? (
              <PrimaryButton
                label="Continue"
                disabled={!step1Valid}
                onPress={() => setStep(2)}
              />
            ) : null}

            {step === 2 ? (
              <>
                <PrimaryButton label="Continue" onPress={() => setStep(3)} />
                <SkipLink label="Skip — finish later" onPress={finish} />
              </>
            ) : null}

            {step === 3 ? (
              <>
                <PrimaryButton
                  label={submitting ? 'Setting up…' : 'Finish setup'}
                  onPress={finish}
                  busy={submitting}
                />
                <SkipLink label="Skip — I'll add these later" onPress={finish} />
              </>
            ) : null}
          </View>

          {step === 1 ? (
            <Text style={styles.skipNote}>
              Two more optional steps after this — you can stop here and get
              the lean experience.
            </Text>
          ) : null}

          <View style={styles.footer}>
            {step > 1 ? (
              <Pressable
                onPress={() => setStep((s) => (s === 3 ? 2 : 1))}
                accessibilityRole="link"
              >
                <Text style={styles.footerLink}>← Back</Text>
              </Pressable>
            ) : (
              <>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Pressable
                  onPress={() => router.replace('/login')}
                  accessibilityRole="link"
                  hitSlop={8}
                >
                  <Text style={styles.footerLink}>Sign in</Text>
                </Pressable>
              </>
            )}
          </View>

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step renderers
// ─────────────────────────────────────────────────────────────────────────────

interface Step1Props {
  email: string; setEmail: (v: string) => void;
  displayName: string; setDisplayName: (v: string) => void;
  streetAddress: string; setStreetAddress: (v: string) => void;
  unit: string; setUnit: (v: string) => void;
  housing: HousingStatus | null; setHousing: (v: HousingStatus) => void;
  commute: CommuteMode | null; setCommute: (v: CommuteMode) => void;
  consentSentiment: boolean; setConsentSentiment: React.Dispatch<React.SetStateAction<boolean>>;
  consentNeighborhood: boolean; setConsentNeighborhood: React.Dispatch<React.SetStateAction<boolean>>;
  consentRetention: boolean; setConsentRetention: React.Dispatch<React.SetStateAction<boolean>>;
  consentEmailDigest: boolean; setConsentEmailDigest: React.Dispatch<React.SetStateAction<boolean>>;
}

function Step1(p: Step1Props) {
  return (
    <>
      <View style={styles.header}>
        <Eyebrow style={{ marginBottom: spacing.md }}>Step 1 of 3 · 30 seconds</Eyebrow>
        <Text style={styles.headline}>Get set up.</Text>
        <Text style={styles.subhead}>
          We ask only what we need to flag what affects your block. Skip
          anything that's not required — every field is justified.
        </Text>
      </View>

      <Section title="You">
        <Field label="Email" hint="We'll send a magic link. No passwords." required>
          <TextInput
            style={styles.input}
            value={p.email}
            onChangeText={p.setEmail}
            placeholder="you@cambridgemail.com"
            placeholderTextColor={colors.muted.light}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
          />
        </Field>

        <Field
          label="Display name"
          hint="First name only is fine. Used for your greeting only."
          required
        >
          <TextInput
            style={styles.input}
            value={p.displayName}
            onChangeText={p.setDisplayName}
            placeholder="Emily"
            placeholderTextColor={colors.muted.light}
            autoCapitalize="words"
            maxLength={40}
            autoComplete="given-name"
            textContentType="givenName"
          />
        </Field>
      </Section>

      <Section title="Where you live">
        <Field
          label="Street address"
          hint="Used for block-level relevance — never displayed back."
          required
        >
          <TextInput
            style={styles.input}
            value={p.streetAddress}
            onChangeText={p.setStreetAddress}
            placeholder="42 Massachusetts Ave"
            placeholderTextColor={colors.muted.light}
            autoCapitalize="words"
            autoComplete="address-line1"
            textContentType="streetAddressLine1"
          />
        </Field>

        <Field label="Unit" hint="Apt #, unit. Optional.">
          <TextInput
            style={styles.input}
            value={p.unit}
            onChangeText={p.setUnit}
            placeholder="Apt 3B"
            placeholderTextColor={colors.muted.light}
            autoCapitalize="characters"
            autoComplete="address-line2"
            textContentType="streetAddressLine2"
          />
        </Field>

        <Field label="Housing status" required>
          <View style={styles.chipRow}>
            {HOUSING_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={p.housing === opt.value}
                onPress={() => p.setHousing(opt.value)}
              />
            ))}
          </View>
        </Field>
      </Section>

      <Section title="How you get around">
        <Field
          label="Primary commute"
          hint="Drives transit, bike-lane, parking and complete-streets relevance."
          required
        >
          <View style={styles.chipGrid}>
            {COMMUTE_OPTIONS.map((opt) => (
              <IconChip
                key={opt.value}
                label={opt.label}
                icon={opt.icon}
                selected={p.commute === opt.value}
                onPress={() => p.setCommute(opt.value)}
              />
            ))}
          </View>
        </Field>
      </Section>

      <Section title="Consent">
        <Consent
          checked={p.consentSentiment}
          onToggle={() => p.setConsentSentiment((v) => !v)}
          text="Reactions I submit are aggregated anonymously and shared with city council."
        />
        <Consent
          checked={p.consentNeighborhood}
          onToggle={() => p.setConsentNeighborhood((v) => !v)}
          text="Aggregated reactions may be grouped by neighborhood — never by my identity."
        />
        <Consent
          checked={p.consentRetention}
          onToggle={() => p.setConsentRetention((v) => !v)}
          text="I've reviewed the privacy policy and data-retention window."
        />
        <Consent
          checked={p.consentEmailDigest}
          onToggle={() => p.setConsentEmailDigest((v) => !v)}
          text="Email me a weekly digest. Optional."
          optional
        />
      </Section>
    </>
  );
}

interface Step2Props {
  composition: Composition | null;
  setComposition: (v: Composition) => void;
  topics: IssueTag[];
  toggleTopic: (t: IssueTag) => void;
  yearsInCambridge: YearsInCambridge | null;
  setYearsInCambridge: (v: YearsInCambridge) => void;
}

function Step2(p: Step2Props) {
  return (
    <>
      <View style={styles.header}>
        <Eyebrow style={{ marginBottom: spacing.md }}>Step 2 of 3 · 60 seconds</Eyebrow>
        <Text style={styles.headline}>Sharpen the signal.</Text>
        <Text style={styles.subhead}>
          Three quick questions that help our relevance ranker surface items
          that matter to you. All optional — skip anything you'd rather not
          answer.
        </Text>
      </View>

      <Section title="Household">
        <Field
          label="Composition"
          hint="Schools, childcare, family services, eldercare relevance."
        >
          <View style={styles.chipRow}>
            {COMPOSITION_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={p.composition === opt.value}
                onPress={() => p.setComposition(opt.value)}
              />
            ))}
          </View>
        </Field>
      </Section>

      <Section title="Issue interests">
        <Field
          label={`Topics · ${p.topics.length}/${MAX_TOPICS}`}
          hint="Pick up to five. Boosts relevance directly and filters your digest."
        >
          <View style={styles.chipRow}>
            {TOPIC_KEYS.map((t) => {
              const selected = p.topics.includes(t);
              const color = TOPIC_COLORS[t].light;
              return (
                <Pressable
                  key={t}
                  onPress={() => p.toggleTopic(t)}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && {
                      backgroundColor: color,
                      borderColor: color,
                    },
                    pressed && { opacity: 0.7 },
                    !selected && p.topics.length >= MAX_TOPICS && { opacity: 0.4 },
                  ]}
                  disabled={!selected && p.topics.length >= MAX_TOPICS}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {TOPIC_LABEL[t]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Field>
      </Section>

      <Section title="Cambridge tenure">
        <Field
          label="Years in Cambridge"
          hint="Frames historical context (e.g. 'first revision since 2008…')."
        >
          <View style={styles.chipRow}>
            {YEARS_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={p.yearsInCambridge === opt.value}
                onPress={() => p.setYearsInCambridge(opt.value)}
              />
            ))}
          </View>
        </Field>
      </Section>
    </>
  );
}

interface Step3Props {
  ageBracket: AgeBracket | null;
  setAgeBracket: (v: AgeBracket) => void;
  gender: Gender | null;
  setGender: (v: Gender) => void;
  raceEthnicity: RaceEthnicity[];
  toggleRace: (r: RaceEthnicity) => void;
  incomeBracket: IncomeBracket | null;
  setIncomeBracket: (v: IncomeBracket) => void;
  primaryLanguage: Language | null;
  setPrimaryLanguage: (v: Language) => void;
  voterRegistered: VoterStatus | null;
  setVoterRegistered: (v: VoterStatus) => void;
}

function Step3(p: Step3Props) {
  return (
    <>
      <View style={styles.header}>
        <Eyebrow style={{ marginBottom: spacing.md }}>Step 3 of 3 · all optional</Eyebrow>
        <Text style={styles.headline}>Optional demographics.</Text>
        <Text style={styles.subhead}>
          We use these only to surface items that specifically affect your
          community — never to label you, and never shared with council in any
          form that identifies you. Every field is individually skippable.
        </Text>
      </View>

      <Section title="About you">
        <Field label="Age">
          <View style={styles.chipRow}>
            {AGE_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={p.ageBracket === opt.value}
                onPress={() => p.setAgeBracket(opt.value)}
                tone={opt.value === 'pnts' ? 'subtle' : 'default'}
              />
            ))}
          </View>
        </Field>

        <Field label="Gender">
          <View style={styles.chipRow}>
            {GENDER_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={p.gender === opt.value}
                onPress={() => p.setGender(opt.value)}
                tone={opt.value === 'pnts' ? 'subtle' : 'default'}
              />
            ))}
          </View>
        </Field>

        <Field
          label="Race / ethnicity"
          hint="Multi-select. 'Prefer not to say' clears the others."
        >
          <View style={styles.chipRow}>
            {RACE_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={p.raceEthnicity.includes(opt.value)}
                onPress={() => p.toggleRace(opt.value)}
                tone={opt.value === 'pnts' ? 'subtle' : 'default'}
              />
            ))}
          </View>
        </Field>
      </Section>

      <Section title="Means & language">
        <Field
          label="Household income"
          hint="Means-tested programs, AMI thresholds, property-tax relief."
        >
          <View style={styles.chipRow}>
            {INCOME_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={p.incomeBracket === opt.value}
                onPress={() => p.setIncomeBracket(opt.value)}
                tone={opt.value === 'pnts' ? 'subtle' : 'default'}
              />
            ))}
          </View>
        </Field>

        <Field label="Primary language">
          <View style={styles.chipRow}>
            {LANGUAGE_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={p.primaryLanguage === opt.value}
                onPress={() => p.setPrimaryLanguage(opt.value)}
                tone={opt.value === 'pnts' ? 'subtle' : 'default'}
              />
            ))}
          </View>
        </Field>
      </Section>

      <Section title="Civic engagement">
        <Field
          label="Registered to vote in Cambridge"
          hint="Frames 'what you can vote on'. Non-citizens still get full app value."
        >
          <View style={styles.chipRow}>
            {VOTER_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                selected={p.voterRegistered === opt.value}
                onPress={() => p.setVoterRegistered(opt.value)}
                tone={opt.value === 'pnts' ? 'subtle' : 'default'}
              />
            ))}
          </View>
        </Field>
      </Section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────────────────────────────────────

function Progress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <View style={styles.progress}>
      {[1, 2, 3].map((n) => (
        <View
          key={n}
          style={[
            styles.progressSegment,
            n <= step && styles.progressSegmentActive,
          ]}
        />
      ))}
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled,
  busy,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.submit,
        disabled && { opacity: 0.4 },
        pressed && !disabled && { opacity: 0.85 },
      ]}
      onPress={onPress}
      disabled={disabled || busy}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {busy ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Text style={styles.submitText}>{label}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </>
      )}
    </Pressable>
  );
}

function SkipLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      style={({ pressed }) => [styles.skip, pressed && { opacity: 0.6 }]}
    >
      <Text style={styles.skipText}>{label}</Text>
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabelRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {required ? <Text style={styles.required}>·  required</Text> : null}
      </View>
      {children}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
  tone = 'default',
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  tone?: 'default' | 'subtle';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        tone === 'subtle' && styles.chipSubtle,
        selected && styles.chipSelected,
        pressed && { opacity: 0.7 },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

function IconChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconChip,
        selected && styles.chipSelected,
        pressed && { opacity: 0.7 },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Ionicons
        name={icon}
        size={20}
        color={selected ? '#FFFFFF' : colors.headline.light}
      />
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Consent({
  checked,
  onToggle,
  text,
  optional,
}: {
  checked: boolean;
  onToggle: () => void;
  text: string;
  optional?: boolean;
}) {
  return (
    <Pressable
      style={styles.consentRow}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.consentText}>{text}</Text>
        {optional ? <Text style={styles.consentOptional}>Optional</Text> : null}
      </View>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  glow: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.5,
  },
  glowTopLeft: {
    width: 280,
    height: 280,
    top: -100,
    left: -90,
    backgroundColor: '#D8E4EC',
  },
  glowBottomRight: {
    width: 320,
    height: 320,
    bottom: -120,
    right: -120,
    backgroundColor: '#E2EAF1',
  },
  progress: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.lg,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.muted.light + '25',
  },
  progressSegmentActive: {
    backgroundColor: colors.headline.light,
  },
  header: {
    paddingBottom: spacing.lg,
  },
  headline: {
    fontFamily: fonts.serifBold,
    fontSize: 38,
    lineHeight: 42,
    color: colors.headline.light,
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  subhead: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted.light,
    maxWidth: 360,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.muted.light,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.card.white,
    borderRadius: radius.card,
    padding: spacing.md + 4,
    gap: spacing.md,
    ...shadows.cardSoft,
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  fieldLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
    color: colors.body.light,
  },
  required: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.accent.light,
    marginLeft: 6,
  },
  input: {
    height: 50,
    borderRadius: radius.mini,
    borderWidth: 1,
    borderColor: colors.muted.light + '25',
    paddingHorizontal: spacing.md,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.headline.light,
    backgroundColor: '#FBFCFD',
  },
  hint: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted.light,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  chipGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: spacing.md,
    height: 42,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.muted.light + '30',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBFCFD',
  },
  chipSubtle: {
    backgroundColor: colors.page,
    borderStyle: 'dashed',
  },
  iconChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    height: 42,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.muted.light + '30',
    backgroundColor: '#FBFCFD',
  },
  chipSelected: {
    backgroundColor: colors.headline.light,
    borderColor: colors.headline.light,
  },
  chipText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    color: colors.headline.light,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.muted.light + '60',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBFCFD',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.accent.light,
    borderColor: colors.accent.light,
  },
  consentText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.body.light,
  },
  consentOptional: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.muted.light,
    marginTop: 2,
  },
  actions: {
    gap: spacing.sm + 2,
    marginTop: spacing.md,
  },
  submit: {
    height: 56,
    borderRadius: radius.mini,
    backgroundColor: colors.headline.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.cardLift,
  },
  submitText: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  skip: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    color: colors.muted.light,
  },
  skipNote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    textAlign: 'center',
    color: colors.muted.light,
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  footerText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted.light,
  },
  footerLink: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: colors.accent.light,
  },
});
