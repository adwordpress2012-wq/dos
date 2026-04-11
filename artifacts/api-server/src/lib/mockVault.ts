/**
 * mockVault.ts — Directive OS Simulated VaultRE Bridge
 * Western Sydney market snapshot, May 2026.
 * Inspection times format: "Sat 2 May, 10:00-10:30am"
 * Auction listings include auctionDate + auctionTime.
 */

export interface MockVaultListing {
  vaultreId: string;
  address: string;
  suburb: string;
  state: "NSW";
  postcode: string;
  price: string;
  listingType: "sale" | "rental";
  listingMethod: "private_treaty" | "auction" | "expression_of_interest";
  bedrooms: number;
  bathrooms: number;
  carSpaces?: number;
  agentName: string;
  agentMobile: string;
  inspectionTimes: string[];
  auctionDate?: string;
  auctionTime?: string;
  status: "active" | "under_offer" | "sold" | "leased";
  description?: string;
  photoUrl?: string;
}

export const MOCK_VAULT_LISTINGS: MockVaultListing[] = [
  // --- Penrith — AUCTION ---
  {
    vaultreId: "VR-WSY-001",
    address: "14 Jamison Road",
    suburb: "Penrith",
    state: "NSW",
    postcode: "2750",
    price: "Auction",
    listingType: "sale",
    listingMethod: "auction",
    bedrooms: 4,
    bathrooms: 2,
    carSpaces: 2,
    agentName: "Mark Thompson",
    agentMobile: "0412 301 112",
    inspectionTimes: [
      "Sat 3 May, 10:00-10:30am",
      "Sat 10 May, 10:00-10:30am",
      "Sat 17 May, 10:00-10:30am",
    ],
    auctionDate: "Sat 17 May",
    auctionTime: "11:00am",
    status: "active",
    description: "Spacious 4-bedroom family home in the heart of Penrith. Double garage, large covered alfresco, ducted air conditioning throughout, and a beautifully landscaped backyard. Walking distance to Penrith train station and Westfield.",
    photoUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
  },
  // --- Penrith — RENTAL ---
  {
    vaultreId: "VR-WSY-002",
    address: "3/88 Henry Street",
    suburb: "Penrith",
    state: "NSW",
    postcode: "2750",
    price: "$490/week",
    listingType: "rental",
    listingMethod: "private_treaty",
    bedrooms: 2,
    bathrooms: 1,
    carSpaces: 1,
    agentName: "Lisa Nguyen",
    agentMobile: "0423 412 223",
    inspectionTimes: [
      "Wed 7 May, 5:00-5:30pm",
      "Sat 10 May, 10:00-10:30am",
    ],
    status: "active",
    description: "Neat and tidy 2-bedroom unit in a small complex, just 800m to Penrith CBD. Updated kitchen and bathroom, secure car space, pet-friendly on application.",
    photoUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
  },
  // --- Colyton — Private Treaty ---
  {
    vaultreId: "VR-WSY-003",
    address: "22 Rosenthal Street",
    suburb: "Colyton",
    state: "NSW",
    postcode: "2760",
    price: "$780,000",
    listingType: "sale",
    listingMethod: "private_treaty",
    bedrooms: 3,
    bathrooms: 1,
    carSpaces: 1,
    agentName: "David Santos",
    agentMobile: "0434 523 334",
    inspectionTimes: [
      "Sat 3 May, 12:00-12:30pm",
      "Sat 10 May, 12:00-12:30pm",
    ],
    status: "active",
    description: "Classic 3-bedroom brick home on a generous 556sqm block in Colyton. Freshly painted, updated kitchen, single lock-up garage, and a large backyard perfect for a pool or granny flat (STCA).",
    photoUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80",
  },
  // --- Colyton — RENTAL ---
  {
    vaultreId: "VR-WSY-004",
    address: "7 Illaroo Place",
    suburb: "Colyton",
    state: "NSW",
    postcode: "2760",
    price: "$460/week",
    listingType: "rental",
    listingMethod: "private_treaty",
    bedrooms: 3,
    bathrooms: 1,
    carSpaces: 1,
    agentName: "Rachel Kim",
    agentMobile: "0445 634 445",
    inspectionTimes: [
      "Tue 6 May, 4:30-5:00pm",
      "Sat 3 May, 9:30-10:00am",
      "Sat 10 May, 9:30-10:00am",
    ],
    status: "active",
    description: "Neat 3-bedroom home in a quiet cul-de-sac. Recently renovated bathroom, tiled living areas, single lock-up garage. Close to schools, parks, and local shops.",
    photoUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  },
  // --- Blacktown — AUCTION ---
  {
    vaultreId: "VR-WSY-005",
    address: "45 Richmond Road",
    suburb: "Blacktown",
    state: "NSW",
    postcode: "2148",
    price: "Auction",
    listingType: "sale",
    listingMethod: "auction",
    bedrooms: 5,
    bathrooms: 3,
    carSpaces: 2,
    agentName: "Mark Thompson",
    agentMobile: "0412 301 112",
    inspectionTimes: [
      "Sat 3 May, 2:00-2:45pm",
      "Sun 4 May, 11:00-11:45am",
      "Sat 10 May, 2:00-2:45pm",
      "Sun 11 May, 11:00-11:45am",
    ],
    auctionDate: "Sat 24 May",
    auctionTime: "1:00pm",
    status: "active",
    description: "Impressive 5-bedroom executive home, ideal for large families. Multiple living areas, gourmet kitchen with stone benchtops, alfresco entertaining, and a solar-heated in-ground pool. A must-inspect.",
    photoUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  },
  // --- Blacktown — RENTAL ---
  {
    vaultreId: "VR-WSY-006",
    address: "12/4 Kildare Road",
    suburb: "Blacktown",
    state: "NSW",
    postcode: "2148",
    price: "$520/week",
    listingType: "rental",
    listingMethod: "private_treaty",
    bedrooms: 2,
    bathrooms: 2,
    carSpaces: 1,
    agentName: "Lisa Nguyen",
    agentMobile: "0423 412 223",
    inspectionTimes: [
      "Thu 8 May, 5:30-6:00pm",
      "Sat 3 May, 11:30am-12:00pm",
      "Sat 10 May, 11:30am-12:00pm",
    ],
    status: "active",
    description: "Modern 2-bedroom, 2-bathroom apartment in a boutique complex. Open-plan living, private balcony, built-in wardrobes, secure parking. Minutes to Blacktown station and Westpoint.",
    photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  // --- St Marys — Private Treaty (Under Offer) ---
  {
    vaultreId: "VR-WSY-007",
    address: "19 Great Western Highway",
    suburb: "St Marys",
    state: "NSW",
    postcode: "2760",
    price: "$820,000",
    listingType: "sale",
    listingMethod: "private_treaty",
    bedrooms: 4,
    bathrooms: 2,
    carSpaces: 2,
    agentName: "David Santos",
    agentMobile: "0434 523 334",
    inspectionTimes: [
      "Sat 3 May, 10:30-11:00am",
      "Sun 4 May, 2:00-2:30pm",
    ],
    status: "under_offer",
    description: "Well-presented 4-bedroom home in a sought-after St Marys location. Renovated kitchen and bathrooms, timber floors, ducted air, double lock-up garage with internal access. 500m to St Marys station.",
    photoUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  },
  // --- St Marys — RENTAL ---
  {
    vaultreId: "VR-WSY-008",
    address: "6 Canberra Street",
    suburb: "St Marys",
    state: "NSW",
    postcode: "2760",
    price: "$480/week",
    listingType: "rental",
    listingMethod: "private_treaty",
    bedrooms: 3,
    bathrooms: 1,
    carSpaces: 1,
    agentName: "Rachel Kim",
    agentMobile: "0445 634 445",
    inspectionTimes: [
      "Mon 5 May, 5:00-5:30pm",
      "Sat 3 May, 12:30-1:00pm",
      "Sat 10 May, 12:30-1:00pm",
    ],
    status: "active",
    description: "Solid 3-bedroom brick home on a 540sqm block. Spacious living, covered outdoor entertaining, single garage. Close to St Marys station, schools, and the M4 motorway.",
    photoUrl: "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=600&q=80",
  },
  // --- Glenmore Park — AUCTION ---
  {
    vaultreId: "VR-WSY-009",
    address: "31 Andrews Road",
    suburb: "Glenmore Park",
    state: "NSW",
    postcode: "2745",
    price: "Auction",
    listingType: "sale",
    listingMethod: "auction",
    bedrooms: 4,
    bathrooms: 2,
    carSpaces: 2,
    agentName: "Mark Thompson",
    agentMobile: "0412 301 112",
    inspectionTimes: [
      "Sat 3 May, 1:00-1:30pm",
      "Sun 4 May, 10:00-10:30am",
      "Sat 10 May, 1:00-1:30pm",
      "Sun 11 May, 10:00-10:30am",
    ],
    auctionDate: "Sat 17 May",
    auctionTime: "2:30pm",
    status: "active",
    description: "Premium family home in the highly desirable Glenmore Park estate. Open-plan design with high ceilings, chef's kitchen, alfresco entertaining overlooking a large yard, and quality finishes throughout.",
    photoUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80",
  },
  // --- Kingswood — RENTAL ---
  {
    vaultreId: "VR-WSY-010",
    address: "4/15 Bringelly Road",
    suburb: "Kingswood",
    state: "NSW",
    postcode: "2747",
    price: "$580/week",
    listingType: "rental",
    listingMethod: "private_treaty",
    bedrooms: 3,
    bathrooms: 2,
    carSpaces: 1,
    agentName: "Lisa Nguyen",
    agentMobile: "0423 412 223",
    inspectionTimes: [
      "Wed 7 May, 12:00-12:30pm",
      "Sat 3 May, 2:00-2:30pm",
      "Sat 10 May, 2:00-2:30pm",
    ],
    status: "active",
    description: "Stylish 3-bedroom townhouse in a modern complex. Two-storey design, open-plan kitchen and living, private courtyard, single lock-up garage. Walking distance to Western Sydney University.",
    photoUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  },
];

export const MOCK_VAULT_SUMMARY = {
  totalListings: MOCK_VAULT_LISTINGS.length,
  activeListings: MOCK_VAULT_LISTINGS.filter(l => l.status === "active").length,
  forSale: MOCK_VAULT_LISTINGS.filter(l => l.listingType === "sale").length,
  forRent: MOCK_VAULT_LISTINGS.filter(l => l.listingType === "rental").length,
  auctions: MOCK_VAULT_LISTINGS.filter(l => l.listingMethod === "auction").length,
  suburbs: [...new Set(MOCK_VAULT_LISTINGS.map(l => l.suburb))],
  agents: [...new Set(MOCK_VAULT_LISTINGS.map(l => l.agentName))],
  lastSynced: new Date().toISOString(),
  source: "VaultRE Simulation Bridge v2.1",
  mode: "SIMULATION",
};
