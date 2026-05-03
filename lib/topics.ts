import type { IssueTag } from "@/lib/types/shared";

export interface TopicColor {
  light: string;
  dark: string;
  pigment: string;
}

export const TOPIC_COLORS: Record<IssueTag, TopicColor> = {
  housing: { light: "#3875A6", dark: "#6BAEEB", pigment: "Steel blue" },
  transit: { light: "#24578F", dark: "#5793D6", pigment: "Deeper blue" },
  climate: { light: "#297A5C", dark: "#52B88F", pigment: "Deep teal-green" },
  schools: { light: "#8F6B24", dark: "#D6AD57", pigment: "Ochre" },
  public_safety: { light: "#9E4729", dark: "#E08557", pigment: "Brick" },
  small_business: { light: "#42756B", dark: "#70B3A3", pigment: "Slate green" },
  civil_liberties: { light: "#753D8F", dark: "#AD75D1", pigment: "Plum" },
  zoning: { light: "#943347", dark: "#E06B7A", pigment: "Burgundy" },
};

export const TOPIC_LABEL: Record<IssueTag, string> = {
  housing: "Housing",
  transit: "Transit",
  climate: "Climate",
  schools: "Schools",
  public_safety: "Public Safety",
  small_business: "Small Business",
  civil_liberties: "Civil Liberties",
  zoning: "Zoning",
};
