/**
 * mockVault.ts — Directive OS Simulated VaultRE Bridge
 *
 * Returns a realistic snapshot of NSW property data as if pulled from a live VaultRE CRM feed.
 * All properties, agents, and prices reflect plausible Sydney/NSW market conditions circa 2026.
 * Active when DATABASE_MODE=SIMULATION.
 */

export interface MockVaultListing {
  vaultreId: string;
  address: string;
  suburb: string;
  state: "NSW";
  postcode: string;
  price: string;
  listingType: "sale" | "rental";
  bedrooms: number;
  bathrooms: number;
  carSpaces?: number;
  agentName: string;
  agentMobile: string;
  inspectionTimes: string[];
  status: "active" | "under_offer" | "sold" | "leased";
  description?: string;
}

export const MOCK_VAULT_LISTINGS: MockVaultListing[] = [
  // --- Cronulla ---
  {
    vaultreId: "VR-NSW-001",
    address: "12 Elouera Road",
    suburb: "Cronulla",
    state: "NSW",
    postcode: "2230",
    price: "$3,150,000",
    listingType: "sale",
    bedrooms: 4,
    bathrooms: 2,
    carSpaces: 2,
    agentName: "Sarah Mitchell",
    agentMobile: "0412 111 222",
    inspectionTimes: ["Saturday 11:00-11:30am", "Sunday 2:00-2:30pm"],
    status: "active",
    description: "Stunning 4-bed family home a short stroll from Cronulla Beach. North-facing rear with in-ground pool, Miele kitchen, and double lock-up garage.",
  },
  {
    vaultreId: "VR-NSW-002",
    address: "7/23 Gerrale Street",
    suburb: "Cronulla",
    state: "NSW",
    postcode: "2230",
    price: "$720/week",
    listingType: "rental",
    bedrooms: 2,
    bathrooms: 1,
    carSpaces: 1,
    agentName: "Emma Rodriguez",
    agentMobile: "0434 333 444",
    inspectionTimes: ["Wednesday 12:00-12:30pm", "Saturday 9:00-9:30am"],
    status: "active",
    description: "Modern 2-bed apartment in the heart of Cronulla. Freshly renovated kitchen and bathroom, secure parking, 200m to train station.",
  },

  // --- Surry Hills ---
  {
    vaultreId: "VR-NSW-003",
    address: "45 Crown Street",
    suburb: "Surry Hills",
    state: "NSW",
    postcode: "2010",
    price: "$1,380/week",
    listingType: "rental",
    bedrooms: 2,
    bathrooms: 2,
    carSpaces: 1,
    agentName: "James Chen",
    agentMobile: "0423 222 333",
    inspectionTimes: ["Tuesday 5:30-6:00pm", "Saturday 10:30-11:00am"],
    status: "active",
    description: "Architecturally renovated terrace in the beating heart of Surry Hills. Original sandstone, polished concrete, and rooftop entertaining.",
  },
  {
    vaultreId: "VR-NSW-004",
    address: "12/88 Foveaux Street",
    suburb: "Surry Hills",
    state: "NSW",
    postcode: "2010",
    price: "$1,100,000",
    listingType: "sale",
    bedrooms: 2,
    bathrooms: 1,
    carSpaces: 1,
    agentName: "Sarah Mitchell",
    agentMobile: "0412 111 222",
    inspectionTimes: ["Saturday 11:30am-12:00pm"],
    status: "active",
    description: "Chic 2-bed apartment in a boutique block. Exposed brick, chef's kitchen with stone bench tops, oversized balcony.",
  },

  // --- Bondi ---
  {
    vaultreId: "VR-NSW-005",
    address: "3/201 Campbell Parade",
    suburb: "Bondi Beach",
    state: "NSW",
    postcode: "2026",
    price: "$4,750,000",
    listingType: "sale",
    bedrooms: 3,
    bathrooms: 2,
    carSpaces: 1,
    agentName: "James Chen",
    agentMobile: "0423 222 333",
    inspectionTimes: ["Saturday 2:00-2:45pm", "Sunday 11:00-11:45am"],
    status: "active",
    description: "Rare beachfront 3-bed penthouse with direct panoramic views of Bondi Beach. Sweeping ocean views from every room, designer interiors throughout.",
  },

  // --- Manly ---
  {
    vaultreId: "VR-NSW-006",
    address: "18 The Corso",
    suburb: "Manly",
    state: "NSW",
    postcode: "2095",
    price: "$2,250,000",
    listingType: "sale",
    bedrooms: 3,
    bathrooms: 2,
    carSpaces: 1,
    agentName: "Emma Rodriguez",
    agentMobile: "0434 333 444",
    inspectionTimes: ["Saturday 1:00-1:30pm"],
    status: "under_offer",
    description: "Substantial family home on a 650sqm block, 400m from Manly Beach and Ferry Wharf. Perfect as a family home or high-yield investment.",
  },

  // --- Chatswood ---
  {
    vaultreId: "VR-NSW-007",
    address: "901/25 Victor Street",
    suburb: "Chatswood",
    state: "NSW",
    postcode: "2067",
    price: "$1,650/week",
    listingType: "rental",
    bedrooms: 3,
    bathrooms: 2,
    carSpaces: 2,
    agentName: "Michael Wong",
    agentMobile: "0445 444 555",
    inspectionTimes: ["Thursday 5:00-5:30pm", "Saturday 12:00-12:30pm"],
    status: "active",
    description: "Luxury level 9 sub-penthouse with CBD skyline views. Floor-to-ceiling glass, premium finishes, resort-style pool and concierge.",
  },

  // --- Newtown ---
  {
    vaultreId: "VR-NSW-008",
    address: "67 Enmore Road",
    suburb: "Newtown",
    state: "NSW",
    postcode: "2042",
    price: "$850/week",
    listingType: "rental",
    bedrooms: 3,
    bathrooms: 1,
    agentName: "Sarah Mitchell",
    agentMobile: "0412 111 222",
    inspectionTimes: ["Monday 5:30-6:00pm", "Saturday 1:00-1:30pm"],
    status: "active",
    description: "Beautifully maintained Victorian terrace on sought-after Enmore Road. Original features, sunny courtyard, 10-min walk to King Street.",
  },

  // --- Balmain ---
  {
    vaultreId: "VR-NSW-009",
    address: "15 Darling Street",
    suburb: "Balmain",
    state: "NSW",
    postcode: "2041",
    price: "$2,900,000",
    listingType: "sale",
    bedrooms: 4,
    bathrooms: 3,
    carSpaces: 2,
    agentName: "James Chen",
    agentMobile: "0423 222 333",
    inspectionTimes: ["Saturday 10:00-10:30am", "Sunday 3:00-3:30pm"],
    status: "active",
    description: "Grand Balmain Federation residence on 620sqm. Wrap-around verandah, 5m ceilings, original pressed tin, fully renovated for modern living.",
  },

  // --- Parramatta ---
  {
    vaultreId: "VR-NSW-010",
    address: "3302/1 Charles Street",
    suburb: "Parramatta",
    state: "NSW",
    postcode: "2150",
    price: "$850/week",
    listingType: "rental",
    bedrooms: 3,
    bathrooms: 2,
    carSpaces: 1,
    agentName: "Emma Rodriguez",
    agentMobile: "0434 333 444",
    inspectionTimes: ["Wednesday 4:00-4:30pm", "Saturday 11:00-11:30am"],
    status: "active",
    description: "Brand-new level 33 apartment in the heart of Parramatta CBD. Panoramic city views, Miele appliances, resort pool, gym and concierge.",
  },
];

export const MOCK_VAULT_SUMMARY = {
  totalListings: MOCK_VAULT_LISTINGS.length,
  activeListings: MOCK_VAULT_LISTINGS.filter(l => l.status === "active").length,
  forSale: MOCK_VAULT_LISTINGS.filter(l => l.listingType === "sale").length,
  forRent: MOCK_VAULT_LISTINGS.filter(l => l.listingType === "rental").length,
  suburbs: [...new Set(MOCK_VAULT_LISTINGS.map(l => l.suburb))],
  agents: [...new Set(MOCK_VAULT_LISTINGS.map(l => l.agentName))],
  lastSynced: new Date().toISOString(),
  source: "VaultRE Simulation Bridge v2.1",
  mode: "SIMULATION",
};
