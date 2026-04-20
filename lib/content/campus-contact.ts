import { campuses, type Campus } from "./campuses";

export type CampusContact = {
  pastorName: string;
  pastorFirst: string;
  campusPhone: string;
  campusEmail: string;
};

const OVERRIDES: Record<string, CampusContact> = {
  paradise: {
    pastorName: "Josh Greenwood",
    pastorFirst: "Josh",
    campusPhone: "+61-8-8555-0001",
    campusEmail: "paradise@futures.church",
  },
  gwinnett: {
    pastorName: "Ashley Evans",
    pastorFirst: "Ashley",
    campusPhone: "+1-770-555-0100",
    campusEmail: "gwinnett@futures.church",
  },
  solo: {
    pastorName: "Adi",
    pastorFirst: "Adi",
    campusPhone: "+62-271-555-010",
    campusEmail: "solo@futures.church",
  },
  "futuros-duluth": {
    pastorName: "Alexis Principal",
    pastorFirst: "Alexis",
    campusPhone: "+1-770-555-0110",
    campusEmail: "futuros-duluth@futures.church",
  },
};

export function getCampusContact(slug: string): CampusContact {
  const override = OVERRIDES[slug];
  if (override) return override;
  const campus = campuses.find((c) => c.slug === slug);
  return {
    pastorName: campus?.leadPastors ?? `${campus?.name ?? "the"} team`,
    pastorFirst: campus?.leadPastors?.split(" ")[0] ?? "the team",
    campusPhone: "+1-000-000-0000",
    campusEmail: `${slug}@futures.church`,
  };
}

export function nearestCampuses(
  lat: number,
  lng: number,
  n = 3
): Campus[] {
  const plotted = campuses.filter(
    (c) => typeof c.lat === "number" && typeof c.lng === "number" && c.status !== "online"
  );
  const withDist = plotted.map((c) => ({
    c,
    d: haversine(lat, lng, c.lat!, c.lng!),
  }));
  withDist.sort((a, b) => a.d - b.d);
  return withDist.slice(0, n).map((x) => x.c);
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
