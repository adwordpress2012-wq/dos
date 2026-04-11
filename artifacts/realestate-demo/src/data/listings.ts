export interface Listing {
  id: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: string;
  type: "sale" | "rental";
  status: "active" | "under_offer" | "sold" | "leased";
  bedrooms: number;
  bathrooms: number;
  carspaces: number;
  landSize?: string;
  inspectionTimes: string[];
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agentPhoto: string;
  description: string;
  features: string[];
  images: string[];
  heroImage: string;
}

export const listings: Listing[] = [
  {
    id: "1",
    address: "14 Blackwood Court",
    suburb: "Baulkham Hills",
    state: "NSW",
    postcode: "2153",
    price: "$1,895,000",
    type: "sale",
    status: "active",
    bedrooms: 5,
    bathrooms: 3,
    carspaces: 2,
    landSize: "712 sqm",
    inspectionTimes: ["Sat 26 Apr 11:00am – 11:30am", "Sun 27 Apr 1:00pm – 1:30pm"],
    agentName: "James Whitfield",
    agentPhone: "0412 345 678",
    agentEmail: "james@meridianproperty.com.au",
    agentPhoto: "https://api.dicebear.com/8.x/avataaars/svg?seed=James&backgroundColor=b6e3f4",
    description: "Welcome to 14 Blackwood Court — a masterclass in contemporary luxury living tucked within one of Baulkham Hills' most sought-after enclaves. This architecturally-designed residence delivers five generous bedrooms, resort-style entertaining, and unparalleled attention to detail across two immaculate levels.\n\nThe heart of the home is a sweeping open-plan kitchen and living zone drenched in northern light, anchored by a stone island bench and premium Smeg appliances. Seamless indoor/outdoor living flows to an undercover alfresco terrace and a sparkling in-ground pool — the perfect backdrop for summer entertaining.\n\nUpstairs, the parents' retreat features a full ensuite, walk-in robe, and a private balcony with leafy district views. Four additional bedrooms are serviced by a stylish main bathroom and separate powder room.",
    features: [
      "Ducted air conditioning throughout",
      "In-ground swimming pool & spa",
      "Gourmet kitchen with stone benchtops",
      "Smeg 900mm freestanding oven",
      "Double lock-up garage with internal access",
      "Timber flooring to living areas",
      "Plantation shutters",
      "Solar panels (10kW)",
      "750m to Baulkham Hills Village",
      "Zoned to Baulkham Hills High School"
    ],
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
    ],
    heroImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600&q=85",
  },
  {
    id: "2",
    address: "3/88 Castle Street",
    suburb: "Castle Hill",
    state: "NSW",
    postcode: "2154",
    price: "$1,195,000",
    type: "sale",
    status: "active",
    bedrooms: 3,
    bathrooms: 2,
    carspaces: 2,
    inspectionTimes: ["Sat 26 Apr 12:00pm – 12:30pm"],
    agentName: "Sophie Chen",
    agentPhone: "0423 456 789",
    agentEmail: "sophie@meridianproperty.com.au",
    agentPhoto: "https://api.dicebear.com/8.x/avataaars/svg?seed=Sophie&backgroundColor=ffdfbf",
    description: "Positioned in a boutique complex of just 12, this stunning top-floor apartment presents an exceptional opportunity to secure premium living in the heart of Castle Hill. With soaring ceilings, an expansive rooftop terrace, and no common walls, this residence feels more like a home than an apartment.\n\nThe open-plan living and dining zone is flooded with natural light and flows effortlessly to a covered balcony with outlook over the Hills District treetops. The kitchen impresses with stone benchtops, integrated dishwasher, and quality European appliances.\n\nAll three bedrooms are generously proportioned, with the master suite featuring a luxurious ensuite and custom walk-in robe.",
    features: [
      "Top-floor position with rooftop terrace",
      "No common walls",
      "Soaring 2.7m ceilings",
      "European appliances",
      "Two side-by-side car spaces",
      "Storage cage",
      "Video intercom",
      "Pet-friendly complex",
      "Walk to Castle Hill Metro Station",
      "300m to Castle Towers shopping centre"
    ],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
    heroImage: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=85",
  },
  {
    id: "3",
    address: "7 Ridgeline Drive",
    suburb: "Kellyville",
    state: "NSW",
    postcode: "2155",
    price: "$2,250,000",
    type: "sale",
    status: "under_offer",
    bedrooms: 6,
    bathrooms: 4,
    carspaces: 3,
    landSize: "902 sqm",
    inspectionTimes: [],
    agentName: "James Whitfield",
    agentPhone: "0412 345 678",
    agentEmail: "james@meridianproperty.com.au",
    agentPhoto: "https://api.dicebear.com/8.x/avataaars/svg?seed=James&backgroundColor=b6e3f4",
    description: "A commanding presence in Kellyville's premier street, this magnificent six-bedroom family estate sets a new benchmark for luxury living in the Hills District. Purpose-built for those who demand the very best, this residence delivers on every front — from the grand entrance foyer to the resort-quality outdoor entertaining precinct.\n\nThe ground floor offers multiple living zones including a formal lounge, theatre room, and an expansive open-plan family and dining area. The chef's kitchen boasts two dishwashers, a butler's pantry, Miele appliances, and a 4-metre stone waterfall island.\n\nCurrently Under Offer — contact us to be notified of similar properties.",
    features: [
      "6 oversized bedrooms, master with retreat",
      "4 full bathrooms + powder room",
      "Chef's kitchen with Miele appliances",
      "Theatre room & formal lounge",
      "Three-car garage",
      "Resort pool with cabana",
      "Outdoor kitchen & firepit",
      "Home office with separate entrance",
      "Smart home automation",
      "900+ sqm of living space"
    ],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80",
    ],
    heroImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=85",
  },
  {
    id: "4",
    address: "22 Wentworth Avenue",
    suburb: "Norwest",
    state: "NSW",
    postcode: "2153",
    price: "$720 per week",
    type: "rental",
    status: "active",
    bedrooms: 4,
    bathrooms: 2,
    carspaces: 2,
    inspectionTimes: ["Sat 26 Apr 10:00am – 10:20am", "Tue 29 Apr 5:30pm – 5:50pm"],
    agentName: "Sophie Chen",
    agentPhone: "0423 456 789",
    agentEmail: "sophie@meridianproperty.com.au",
    agentPhoto: "https://api.dicebear.com/8.x/avataaars/svg?seed=Sophie&backgroundColor=ffdfbf",
    description: "Available Now — This beautifully presented family home in the heart of Norwest offers a lifestyle of comfort and convenience. Spanning two generous levels, the property features four bedrooms, two bathrooms, and a flowing open-plan living and dining area that opens to a private alfresco entertaining space.\n\nThe modern kitchen comes fully equipped with quality appliances and generous bench space. Upstairs, the master bedroom features an ensuite and walk-in robe, while the three additional bedrooms all include built-in robes and are serviced by the well-appointed main bathroom.\n\nWalking distance to Norwest Business Park, public transport, and quality schooling.",
    features: [
      "Ducted air conditioning",
      "Open-plan living & dining",
      "Modern kitchen with dishwasher",
      "Double lock-up garage",
      "Private alfresco entertaining",
      "Built-in robes to all bedrooms",
      "Internal laundry",
      "Pet-friendly (subject to approval)",
      "Close to Norwest Business Park",
      "Walk to bus & light rail"
    ],
    images: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80",
    ],
    heroImage: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1600&q=85",
  },
  {
    id: "5",
    address: "45 Milford Gardens",
    suburb: "Rouse Hill",
    state: "NSW",
    postcode: "2155",
    price: "$630 per week",
    type: "rental",
    status: "leased",
    bedrooms: 3,
    bathrooms: 2,
    carspaces: 1,
    inspectionTimes: [],
    agentName: "James Whitfield",
    agentPhone: "0412 345 678",
    agentEmail: "james@meridianproperty.com.au",
    agentPhoto: "https://api.dicebear.com/8.x/avataaars/svg?seed=James&backgroundColor=b6e3f4",
    description: "Recently leased — Register your interest for similar properties. This modern townhouse is ideally positioned within the Rouse Hill Town Centre precinct, moments from the Metro station, shops, and cafes.\n\nFeaturing three bedrooms, two bathrooms and a single garage, this property is perfect for young families or professionals seeking a low-maintenance lifestyle without compromising on quality or space.",
    features: [
      "Modern townhouse design",
      "Open-plan ground floor living",
      "Alfresco balcony",
      "Single garage",
      "Walk to Rouse Hill Metro",
      "Steps to Rouse Hill Town Centre"
    ],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85",
  },
  {
    id: "6",
    address: "101 Greenway Boulevard",
    suburb: "Stanhope Gardens",
    state: "NSW",
    postcode: "2768",
    price: "$1,450,000",
    type: "sale",
    status: "active",
    bedrooms: 4,
    bathrooms: 2,
    carspaces: 2,
    landSize: "558 sqm",
    inspectionTimes: ["Sat 26 Apr 1:30pm – 2:00pm", "Sun 27 Apr 11:00am – 11:30am"],
    agentName: "Sophie Chen",
    agentPhone: "0423 456 789",
    agentEmail: "sophie@meridianproperty.com.au",
    agentPhoto: "https://api.dicebear.com/8.x/avataaars/svg?seed=Sophie&backgroundColor=ffdfbf",
    description: "A family home of exceptional quality, style, and proportion — 101 Greenway Boulevard showcases modern design at its finest. Set on a prime 558sqm parcel in Stanhope Gardens' most prestigious address, this immaculate four-bedroom home delivers seamless indoor-outdoor living across a beautifully appointed single level.\n\nThe expansive open-plan kitchen, living, and dining zone is the heart of the home, featuring stone benchtops, premium appliances, and floor-to-ceiling windows that frame the beautifully landscaped rear garden.\n\nWith four oversized bedrooms, master with walk-in robe and ensuite, this home ticks every box for the modern family.",
    features: [
      "Single-level living",
      "Premium kitchen with stone benchtops",
      "Alfresco entertaining with outdoor kitchen",
      "Double garage with storage",
      "Ducted A/C & in-floor heating",
      "Oversized master with walk-in robe",
      "Landscaped gardens",
      "Solar panels & battery storage",
      "Zoned to Stanhope Gardens Primary",
      "Close to Norwest Business Park"
    ],
    images: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54bc0b8f4?w=1200&q=80",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80",
    ],
    heroImage: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1600&q=85",
  },
];

export function getListingById(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function getListings(type?: "sale" | "rental"): Listing[] {
  if (!type) return listings;
  return listings.filter((l) => l.type === type);
}
