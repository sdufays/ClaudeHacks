// Expand a UserProfile into a TagVector that the relevance ranker can
// intersect with each CouncilItem's tags. Pure function, no I/O.
//
// Weights are relative within a namespace; cross-namespace weighting is
// applied by the ranker via NAMESPACE_WEIGHTS.

import type { UserProfile } from "../types/shared";
import type { Tag, TagVector } from "./types";

type W = Partial<Record<Tag, number>>;

export function expandProfile(profile: UserProfile): TagVector {
  const tags: Tag[] = [];
  const weights: W = {};

  const add = (tag: Tag, weight = 1.0) => {
    if (!tags.includes(tag)) tags.push(tag);
    weights[tag] = Math.max(weights[tag] ?? 0, weight);
  };

  // Geo
  add(`geo.zip:${profile.zip}` as Tag);
  add(`geo.neighborhood:${profile.neighborhood}` as Tag);
  // Citywide always matches — every resident gets it at low weight
  // so universal items still surface but don't drown out local ones.
  add("geo.scope:citywide" as Tag, 0.4);
  add("geo.scope:neighborhood" as Tag, 0.8);

  // Housing
  if (profile.housingStatus === "rent" || profile.housingStatus === "own") {
    add(`housing.tenure:${profile.housingStatus}` as Tag);
  }
  add("housing.tenure:any" as Tag, 0.5); // catch "any tenure" items
  if (profile.housingType) add(`housing.type:${profile.housingType}` as Tag);
  if (profile.landlordType && profile.landlordType !== "prefer_not_to_say") {
    add(`housing.landlord_size:${profile.landlordType}` as Tag);
  }

  // Transport
  const primary = profile.primaryCommute;
  if (primary === "drive" || primary === "transit" || primary === "bike" || primary === "walk") {
    add(`transport.mode:${primary}` as Tag, 1.0);
  }
  const secondary = profile.secondaryCommute;
  if (
    secondary &&
    (secondary === "drive" || secondary === "transit" || secondary === "bike" || secondary === "walk")
  ) {
    add(`transport.mode:${secondary}` as Tag, 0.5);
  }
  for (const line of profile.transitLines ?? []) {
    add(`transport.line:${line}` as Tag);
  }
  for (const need of profile.accessibilityNeeds ?? []) {
    add(`transport.accessibility:${need}` as Tag);
    add("topic.area:disability" as Tag, 0.6);
  }

  // Household
  if (profile.composition && profile.composition !== "roommates") {
    add(`household.composition:${profile.composition}` as Tag);
  }
  for (const bucket of profile.childrenAgeBuckets ?? []) {
    if (bucket === "0-4") add("household.kids:under_5" as Tag);
    else add("household.kids:k12" as Tag);
  }
  for (const enrollment of profile.schoolEnrollment ?? []) {
    add(`household.school:${enrollment}` as Tag);
    if (enrollment === "cps") add("topic.area:schools" as Tag, 0.5);
  }
  for (const pet of profile.pets ?? []) {
    add(`household.pets:${pet}` as Tag, 0.3);
  }

  // Topic interests — strong boost (user explicitly opted in)
  for (const topic of profile.topics ?? []) {
    add(`topic.area:${topic}` as Tag, 1.5);
  }

  // Demographics — low weight. Relevance agent uses these to surface items
  // that *specifically affect* a group, never to label the user.
  if (profile.ageBracket) {
    if (profile.ageBracket === "18-24") add("demo.age:youth" as Tag);
    else if (profile.ageBracket === "65-74" || profile.ageBracket === "75+") {
      add("demo.age:senior_65plus" as Tag);
    }
    if (
      profile.childrenAgeBuckets?.length ||
      profile.composition === "parent" ||
      profile.composition === "multigen"
    ) {
      add("demo.age:family" as Tag);
    }
  }
  if (profile.gender && profile.gender !== "prefer_not_to_say" && profile.gender !== "self_describe") {
    add(`demo.gender:${profile.gender}` as Tag);
  }
  for (const race of profile.raceEthnicity ?? []) {
    if (race !== "self_describe") {
      add(`demo.race:${race}` as Tag);
      add("demo.race:bipoc" as Tag, 0.5);
    }
  }
  if (profile.incomeBracket) {
    if (profile.incomeBracket === "<25k" || profile.incomeBracket === "25-50k") {
      add("demo.income:low" as Tag);
      add("demo.income:means_tested" as Tag, 0.8);
    } else if (profile.incomeBracket === "150-250k" || profile.incomeBracket === "250k+") {
      add("demo.income:high_income_impact" as Tag, 0.6);
    }
  }
  if (profile.yearsInCambridge) {
    if (profile.yearsInCambridge === "<1" || profile.yearsInCambridge === "1-5") {
      add("demo.tenure_in_city:newcomer" as Tag, 0.4);
    } else if (profile.yearsInCambridge === "15+") {
      add("demo.tenure_in_city:longtime" as Tag, 0.4);
    }
  }
  if (profile.primaryLanguage && profile.primaryLanguage !== "english") {
    add(`demo.language:${profile.primaryLanguage}` as Tag);
  }

  // Civic
  if (profile.voterRegistered === "yes") {
    add("civic.flag:voter_action_required" as Tag, 0.6);
    add("civic.flag:ballot_question" as Tag, 0.6);
  }
  if (profile.priorEngagement?.includes("none")) {
    add("civic.flag:first_timer_friendly" as Tag, 0.6);
  }

  // Work
  if (profile.worksInCambridge === "yes" || profile.worksInCambridge === "hybrid") {
    add("work.audience:cambridge_workers" as Tag);
  }
  if (profile.employerType) {
    add(`work.employer:${profile.employerType}` as Tag);
  }
  if (profile.studentStatus && profile.studentStatus !== "not_a_student") {
    add(`work.student:${profile.studentStatus}` as Tag);
  }

  // Universal fiscal — every resident is affected by water/sewer + property tax
  add("fiscal.kind:water_sewer" as Tag, 0.7);
  add("fiscal.kind:property_tax" as Tag, 0.7);
  if (profile.housingStatus === "own") {
    // Owners care more about transfer fee + property tax
    add("fiscal.kind:transfer_fee" as Tag, 0.8);
  }
  if (profile.primaryCommute === "drive" || profile.secondaryCommute === "drive") {
    add("fiscal.kind:parking_fee" as Tag, 0.8);
  }

  return { tags, weights };
}
