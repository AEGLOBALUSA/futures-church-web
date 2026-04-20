import raw from "@/content/visit-fears.json";

export type VisitFear = {
  id: "alone" | "not-religious" | "only-one";
  heading: string;
  honest: string;
  followup?: string;
};

type RawShape = { fears: VisitFear[] };

export const visitFears: VisitFear[] = (raw as unknown as RawShape).fears;
