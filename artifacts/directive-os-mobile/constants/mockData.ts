export interface Lead {
  id: string;
  name: string;
  leadType: "buyer" | "vendor" | "tenant" | "landlord";
  status: "new" | "contacted" | "qualified" | "closed";
  channel: "voice" | "chat";
  hotLead: boolean;
  phone?: string;
  email?: string;
  notes?: string;
  time: string;
  timeAgo: string;
}

export interface TranscriptMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Transcript {
  id: string;
  leadName: string;
  channel: "voice" | "chat";
  duration?: number;
  messageCount?: number;
  summary: string;
  time: string;
  timeAgo: string;
  leadType: "buyer" | "vendor" | "tenant" | "landlord";
  messages: TranscriptMessage[];
}

export interface ActivityItem {
  id: string;
  type: "call_answered" | "lead_captured" | "email_sent" | "inspection_booked" | "appraisal_booked" | "form_sent";
  description: string;
  detail?: string;
  time: string;
  channel: "voice" | "chat" | "system";
}

export const AGENCY = {
  name: "Meridian Property Group",
  suburb: "Castle Hill, NSW",
  phone: "02 5850 4038",
  aiMinutesUsed: 97,
  aiMinutesIncluded: 100,
  leadsThisMonth: 23,
  aiCallsHandled: 18,
  hotLeads: 2,
  estimatedValue: "$2.3M",
  newLastNight: 5,
};

export const LEADS: Lead[] = [
  {
    id: "1",
    name: "Jason Ojumpo",
    leadType: "buyer",
    status: "new",
    channel: "voice",
    hotLead: true,
    phone: "0412 345 678",
    email: "jason.ojumpo@email.com",
    notes: "Buyer — 4br, Castle Hill, budget $1.8M. Callback booked 11AM.",
    time: "11:42 PM",
    timeAgo: "2h ago",
  },
  {
    id: "2",
    name: "Sarah Chen",
    leadType: "buyer",
    status: "new",
    channel: "chat",
    hotLead: false,
    email: "s.chen@outlook.com",
    notes: "Buyer — interested in 3br Hills District. Inspection requested.",
    time: "9:18 PM",
    timeAgo: "4h ago",
  },
  {
    id: "3",
    name: "Marcus Webb",
    leadType: "vendor",
    status: "contacted",
    channel: "voice",
    hotLead: true,
    phone: "0487 654 321",
    notes: "Vendor — 14 Rosewood Dr, Kellyville. Appraisal booked Friday 2PM.",
    time: "8:55 PM",
    timeAgo: "5h ago",
  },
  {
    id: "4",
    name: "Jennifer Park",
    leadType: "tenant",
    status: "new",
    channel: "chat",
    hotLead: false,
    email: "jen.park@gmail.com",
    notes: "Tenant — looking for 2br rental in Norwest. Budget $650/wk.",
    time: "7:30 PM",
    timeAgo: "6h ago",
  },
  {
    id: "5",
    name: "David Liu",
    leadType: "landlord",
    status: "contacted",
    channel: "voice",
    hotLead: false,
    phone: "0421 987 456",
    notes: "Landlord — 3 investment properties in Baulkham Hills. PM enquiry.",
    time: "6:15 PM",
    timeAgo: "8h ago",
  },
  {
    id: "6",
    name: "Priya Sharma",
    leadType: "buyer",
    status: "qualified",
    channel: "chat",
    hotLead: false,
    email: "priya.s@gmail.com",
    phone: "0455 111 222",
    notes: "Buyer — pre-approved for $950k. Interested in entry-level Hills District.",
    time: "5:00 PM",
    timeAgo: "9h ago",
  },
];

export const TRANSCRIPTS: Transcript[] = [
  {
    id: "t1",
    leadName: "Jason Ojumpo",
    channel: "voice",
    duration: 263,
    summary: "Buyer enquiry — 4br Castle Hill, $1.8M budget. Callback booked 11AM.",
    time: "11:42 PM",
    timeAgo: "2h ago",
    leadType: "buyer",
    messages: [
      { role: "assistant", content: "G'day, thanks for calling Meridian Property Group — this is Sarah, how can I help you today?" },
      { role: "user", content: "Hi yeah, I'm looking to buy in Castle Hill, do you have anything with 4 bedrooms?" },
      { role: "assistant", content: "Absolutely, Castle Hill's a great choice — heaps of great family homes there. What's your rough budget so I can point you in the right direction?" },
      { role: "user", content: "We're looking at around $1.8 million, maybe a bit flexible if it's the right place." },
      { role: "assistant", content: "That's a solid budget for Castle Hill — there's some really good stock in that range right now. Can I grab your name so I can have one of our agents give you a call back with some specifics?" },
      { role: "user", content: "Yeah sure, I'm Jason Ojumpo." },
      { role: "assistant", content: "Brilliant, Jason. And what's the best number to reach you on?" },
      { role: "user", content: "0412 345 678. When can they call?" },
      { role: "assistant", content: "I'll flag this as a priority — one of our agents will call you tomorrow at 11AM. Is that good?" },
      { role: "user", content: "Yeah that works. Cheers." },
      { role: "assistant", content: "Perfect. Talk soon, Jason — no worries!" },
    ],
  },
  {
    id: "t2",
    leadName: "Marcus Webb",
    channel: "voice",
    duration: 370,
    summary: "Vendor — appraisal booked Friday 2PM for 14 Rosewood Drive.",
    time: "8:55 PM",
    timeAgo: "5h ago",
    leadType: "vendor",
    messages: [
      { role: "assistant", content: "G'day, thanks for calling Meridian Property Group — this is Sarah, how can I help you today?" },
      { role: "user", content: "Hi, I'm thinking about selling my house and wanted to get an appraisal done." },
      { role: "assistant", content: "Great timing — our market knowledge in the Hills District is really strong right now. Whereabouts is the property?" },
      { role: "user", content: "14 Rosewood Drive in Kellyville." },
      { role: "assistant", content: "Kellyville's performing really well at the moment. I can lock in a free appraisal with our principal agent — takes about 20 minutes at the property. When suits you?" },
      { role: "user", content: "Friday afternoon would be good, maybe 2pm?" },
      { role: "assistant", content: "Friday at 2PM — done. Can I grab your name and a contact number for confirmation?" },
      { role: "user", content: "Marcus Webb, 0487 654 321." },
      { role: "assistant", content: "You're locked in, Marcus. Our principal will see you Friday at 2PM at Rosewood Drive. You'll get a confirmation text too. Cheers!" },
    ],
  },
  {
    id: "t3",
    leadName: "Sarah Chen",
    channel: "chat",
    messageCount: 12,
    summary: "Buyer — inspection request for 3br Hills District listings.",
    time: "9:18 PM",
    timeAgo: "4h ago",
    leadType: "buyer",
    messages: [
      { role: "user", content: "Hi! I'm interested in buying a 3-bedroom home in the Hills District area." },
      { role: "assistant", content: "Hey! Great to hear — the Hills District is a brilliant area. Are you thinking somewhere specific, like Castle Hill, Kellyville, or Baulkham Hills?" },
      { role: "user", content: "Probably Castle Hill or Norwest. What's your current stock like?" },
      { role: "assistant", content: "We've got some really lovely options in both. Let me have our agent send you the current listings — what's the best email for you?" },
      { role: "user", content: "s.chen@outlook.com" },
      { role: "assistant", content: "Perfect, Sarah — I'll get those across to you. Are you open to attending an inspection this weekend?" },
      { role: "user", content: "Yeah definitely, Saturday morning would be ideal." },
      { role: "assistant", content: "I'll flag Saturday morning for you. Our agent will confirm the inspection times when they're in touch. What's your budget range so they can shortlist the best ones?" },
      { role: "user", content: "Around $1.2-1.4M." },
      { role: "assistant", content: "Great range for that area — there are some really nice options. We'll be in touch shortly!" },
    ],
  },
  {
    id: "t4",
    leadName: "Jennifer Park",
    channel: "chat",
    messageCount: 8,
    summary: "Tenant — 2br rental enquiry, Norwest, $650/wk budget.",
    time: "7:30 PM",
    timeAgo: "6h ago",
    leadType: "tenant",
    messages: [
      { role: "user", content: "Do you have any 2 bedroom rentals available in Norwest?" },
      { role: "assistant", content: "Hi! We do have some options in Norwest — great suburb choice. What's your budget per week?" },
      { role: "user", content: "Around $650 a week ideally." },
      { role: "assistant", content: "That's workable for Norwest. Would you like me to email you our current 2br rentals in that price range?" },
      { role: "user", content: "Yes please! My email is jen.park@gmail.com" },
      { role: "assistant", content: "Perfect, Jennifer — sending those across now. When are you looking to move in?" },
      { role: "user", content: "Ideally within the next 3-4 weeks." },
      { role: "assistant", content: "That's very doable — our agent will be in touch with available inspection times. No worries!" },
    ],
  },
];

export const ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    type: "call_answered",
    description: "Answered call from Jason Ojumpo",
    detail: "4m 23s · Buyer enquiry, Castle Hill",
    time: "11:42 PM",
    channel: "voice",
  },
  {
    id: "a2",
    type: "lead_captured",
    description: "Callback booked — Jason Ojumpo",
    detail: "11AM tomorrow · Priority flag set",
    time: "11:46 PM",
    channel: "system",
  },
  {
    id: "a3",
    type: "email_sent",
    description: "Transcript sent to your inbox",
    detail: "Jason Ojumpo · Buyer, 4br Castle Hill",
    time: "11:47 PM",
    channel: "system",
  },
  {
    id: "a4",
    type: "lead_captured",
    description: "New chat lead — Sarah Chen",
    detail: "Buyer · Inspection requested · 3br Hills District",
    time: "9:18 PM",
    channel: "chat",
  },
  {
    id: "a5",
    type: "email_sent",
    description: "Transcript sent to your inbox",
    detail: "Sarah Chen · Buyer, Castle Hill",
    time: "9:22 PM",
    channel: "system",
  },
  {
    id: "a6",
    type: "appraisal_booked",
    description: "Appraisal booked — Marcus Webb",
    detail: "Friday 2PM · 14 Rosewood Drive, Kellyville",
    time: "8:55 PM",
    channel: "voice",
  },
  {
    id: "a7",
    type: "lead_captured",
    description: "New chat lead — Jennifer Park",
    detail: "Tenant · 2br Norwest, $650/wk",
    time: "7:30 PM",
    channel: "chat",
  },
  {
    id: "a8",
    type: "call_answered",
    description: "Answered call from David Liu",
    detail: "3m 45s · PM enquiry, 3 properties",
    time: "6:15 PM",
    channel: "voice",
  },
  {
    id: "a9",
    type: "email_sent",
    description: "Transcript sent to your inbox",
    detail: "David Liu · Landlord, Baulkham Hills",
    time: "6:19 PM",
    channel: "system",
  },
  {
    id: "a10",
    type: "lead_captured",
    description: "New chat lead — Priya Sharma",
    detail: "Buyer · Pre-approved $950k · Entry Hills District",
    time: "5:00 PM",
    channel: "chat",
  },
];
