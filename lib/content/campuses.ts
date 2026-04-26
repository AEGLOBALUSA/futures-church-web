export type CampusStatus = "active" | "launching" | "online";
export type CampusBrand = "futures" | "futuros";
export type CampusRegion = "australia" | "usa" | "indonesia" | "south-america" | "brazil" | "global";

export type Region = {
  slug: CampusRegion;
  name: string;
  status?: "active" | "launching";
};

export const regions: Region[] = [
  { slug: "australia", name: "Australia", status: "active" },
  { slug: "usa", name: "United States", status: "active" },
  { slug: "indonesia", name: "Indonesia", status: "active" },
  { slug: "south-america", name: "South America", status: "launching" },
  { slug: "brazil", name: "Brazil", status: "launching" },
];

export interface Campus {
  slug: string;
  name: string;
  brand: CampusBrand;
  region: CampusRegion;
  country: string;
  city: string;
  address?: string;
  leadPastors?: string;
  status: CampusStatus;
  lat?: number;
  lng?: number;
  instagram?: string;
  facebook?: string;
  spanish?: boolean;
  /** Human-readable service time, e.g. "Sundays · 10am". Verify per campus before publishing. */
  serviceTime?: string;
}

export const campuses: Campus[] = [
  // Australia (Futures)
  { slug: "paradise", name: "Paradise", brand: "futures", region: "australia", country: "Australia", city: "Paradise, SA", leadPastors: "Tony & Aste Corbridge", status: "active", serviceTime: "Sundays · 10am", lat: -34.8709, lng: 138.6825, instagram: "https://instagram.com/futures.paradise" },
  { slug: "adelaide-city", name: "Adelaide City", brand: "futures", region: "australia", country: "Australia", city: "Adelaide, SA", leadPastors: "Simon & Lauren", status: "active", serviceTime: "Sundays · 10am", lat: -34.9285, lng: 138.6007 },
  { slug: "south", name: "South (Reynella)", brand: "futures", region: "australia", country: "Australia", city: "Reynella, SA", leadPastors: "Doran & Mel", status: "active", serviceTime: "Sundays · 10am", lat: -35.0958, lng: 138.5356 },
  { slug: "clare-valley", name: "Clare Valley", brand: "futures", region: "australia", country: "Australia", city: "Clare, SA", status: "active", serviceTime: "Sundays · 10am", lat: -33.8333, lng: 138.6 },
  { slug: "salisbury", name: "Salisbury", brand: "futures", region: "australia", country: "Australia", city: "Salisbury, SA", leadPastors: "Steve & Janine Donato", status: "active", serviceTime: "Sundays · 10am", lat: -34.7592, lng: 138.6406 },
  { slug: "mount-barker", name: "Mount Barker", brand: "futures", region: "australia", country: "Australia", city: "Mount Barker, SA", status: "active", serviceTime: "Sundays · 10am", lat: -35.0674, lng: 138.859 },
  { slug: "victor-harbor", name: "Victor Harbor", brand: "futures", region: "australia", country: "Australia", city: "Victor Harbor, SA", leadPastors: "Stu Green", status: "active", serviceTime: "Sundays · 10am", lat: -35.5522, lng: 138.6221 },
  { slug: "copper-coast", name: "Copper Coast", brand: "futures", region: "australia", country: "Australia", city: "Kadina, SA", leadPastors: "Shannon & Courtney", status: "active", serviceTime: "Sundays · 10am", lat: -33.9617, lng: 137.7181 },
  { slug: "online", name: "Online Church", brand: "futures", region: "global", country: "Worldwide", city: "Online", status: "online", serviceTime: "Anytime · futures.church/watch" },
  // USA (Futures English)
  { slug: "gwinnett", name: "Gwinnett", brand: "futures", region: "usa", country: "USA", city: "Duluth, GA", leadPastors: "Nick & Danielle Hindle", status: "active", serviceTime: "Sundays · 10am", lat: 34.0029, lng: -84.1446, instagram: "https://instagram.com/futuresgwinnett" },
  { slug: "kennesaw", name: "Kennesaw", brand: "futures", region: "usa", country: "USA", city: "Kennesaw, GA", leadPastors: "Andy Smith", status: "active", serviceTime: "Sundays · 10am", lat: 34.0234, lng: -84.6155 },
  { slug: "alpharetta", name: "Alpharetta", brand: "futures", region: "usa", country: "USA", city: "Alpharetta, GA", address: "12150 Morris Rd", leadPastors: "Ryan Rolls", status: "active", serviceTime: "Sundays · 10am", lat: 34.0754, lng: -84.2941, instagram: "https://instagram.com/futuresalpharetta" },
  { slug: "franklin", name: "Franklin", brand: "futures", region: "usa", country: "USA", city: "Franklin, TN", leadPastors: "Mark & Lauren Evans", status: "active", serviceTime: "Sundays · 10am", lat: 35.9251, lng: -86.8689 },
  // Indonesia — 5 campuses (Cemani, Solo, Samarinda, Langowan, Bali)
  { slug: "cemani", name: "Cemani", brand: "futures", region: "indonesia", country: "Indonesia", city: "Cemani, Central Java", status: "active", serviceTime: "Sundays · 10am", lat: -7.5833, lng: 110.8 },
  { slug: "solo", name: "Solo", brand: "futures", region: "indonesia", country: "Indonesia", city: "Surakarta, Central Java", leadPastors: "Adi & Lala", status: "active", serviceTime: "Sundays · 10am", lat: -7.5666, lng: 110.8317, instagram: "https://instagram.com/futuressolo" },
  { slug: "samarinda", name: "Samarinda", brand: "futures", region: "indonesia", country: "Indonesia", city: "Samarinda, East Kalimantan", status: "active", serviceTime: "Sundays · 10am", lat: -0.5017, lng: 117.1536 },
  { slug: "langowan", name: "Langowan", brand: "futures", region: "indonesia", country: "Indonesia", city: "Langowan, North Sulawesi", status: "active", serviceTime: "Sundays · 10am", lat: 1.1522, lng: 124.8066 },
  { slug: "bali", name: "Bali", brand: "futures", region: "indonesia", country: "Indonesia", city: "Denpasar, Bali", status: "active", serviceTime: "Sundays · 10am", lat: -8.6705, lng: 115.2126 },
  // Futuros (Spanish-speaking arm — 3 of 21)
  { slug: "futuros-duluth", name: "Futuros Duluth", brand: "futuros", region: "usa", country: "USA", city: "Duluth, GA", address: "2838 Duluth Hwy", leadPastors: "Alexis & Susana Principal", status: "active", serviceTime: "Domingos · 10am", spanish: true, lat: 34.0029, lng: -84.1446, facebook: "https://facebook.com/IglesiaFuturos" },
  { slug: "futuros-kennesaw", name: "Futuros Kennesaw", brand: "futuros", region: "usa", country: "USA", city: "Kennesaw, GA", status: "active", serviceTime: "Domingos · 10am", spanish: true, lat: 34.0234, lng: -84.6155 },
  { slug: "futuros-grayson", name: "Futuros Grayson", brand: "futuros", region: "usa", country: "USA", city: "Grayson, GA", status: "launching", spanish: true, lat: 33.8956, lng: -83.9527 },
  // Venezuela (4 launching — push total to 25)
  { slug: "futuros-caracas", name: "Futuros Caracas", brand: "futuros", region: "south-america", country: "Venezuela", city: "Caracas", status: "launching", spanish: true, lat: 10.4806, lng: -66.9036 },
  { slug: "futuros-maracaibo", name: "Futuros Maracaibo", brand: "futuros", region: "south-america", country: "Venezuela", city: "Maracaibo", status: "launching", spanish: true, lat: 10.6666, lng: -71.6124 },
  { slug: "futuros-valencia", name: "Futuros Valencia", brand: "futuros", region: "south-america", country: "Venezuela", city: "Valencia", status: "launching", spanish: true, lat: 10.1621, lng: -68.0077 },
  { slug: "futuros-barquisimeto", name: "Futuros Barquisimeto", brand: "futuros", region: "south-america", country: "Venezuela", city: "Barquisimeto", status: "launching", spanish: true, lat: 10.0647, lng: -69.3467 },
];
