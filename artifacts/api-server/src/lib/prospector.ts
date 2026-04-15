import OpenAI from "openai";
import { logger } from "./logger";

const openai = new OpenAI({ apiKey: process.env.DOS_API_KEY || process.env.OPENAI_API_KEY });

const OWNER_EMAILS = ["adwordpress2012@gmail.com", "jayson@directiveos.com.au"];

// ── Monday: Multicultural Sydney clusters (Chinese/Filipino/Russian focus) ────
const SYDNEY_CLUSTERS = [
  { label: "Chatswood & North Shore Chinese Community", suburbs: "Chatswood, St Leonards, Lane Cove, Willoughby" },
  { label: "Burwood, Strathfield & Inner West Chinese Hub", suburbs: "Burwood, Strathfield, Homebush, Concord" },
  { label: "Hurstville & South Sydney Chinese Community", suburbs: "Hurstville, Kogarah, Rockdale, Banksia" },
  { label: "Cabramatta & Liverpool Filipino Community", suburbs: "Cabramatta, Liverpool, Fairfield, Canley Vale" },
  { label: "Parramatta & Greater West", suburbs: "Parramatta, Westmead, Harris Park, Merrylands" },
  { label: "Ashfield & Campsie Chinese Community", suburbs: "Ashfield, Campsie, Lakemba, Canterbury" },
  { label: "Ryde & Meadowbank", suburbs: "Ryde, Meadowbank, Ermington, West Ryde" },
  { label: "Box Hill & Hills District Growth Corridor", suburbs: "Box Hill, Kellyville, Rouse Hill, Castle Hill" },
  { label: "Eastwood & Epping Chinese Community", suburbs: "Eastwood, Epping, North Epping, Marsfield" },
  { label: "Rhodes & Concord West Chinese Community", suburbs: "Rhodes, Concord West, Liberty Grove, Homebush West" },
];

// ── Wednesday: Jayson's local area — Greater Western Sydney ──────────────────
const LOCAL_CLUSTERS = [
  { label: "Penrith & Blue Mountains Gateway", suburbs: "Penrith, Kingswood, St Marys, Emu Plains, Glenmore Park" },
  { label: "Richmond & Hawkesbury Valley", suburbs: "Richmond, Windsor, Vineyard, Pitt Town, McGraths Hill" },
  { label: "Blacktown & Seven Hills", suburbs: "Blacktown, Seven Hills, Quakers Hill, Stanhope Gardens, Rooty Hill" },
  { label: "Parramatta & Westmead Surrounds", suburbs: "Parramatta, Westmead, Northmead, Old Toongabbie, Wentworthville" },
  { label: "Liverpool & South West Corridor", suburbs: "Liverpool, Moorebank, Casula, Warwick Farm, Prestons" },
  { label: "Fairfield & Cabramatta", suburbs: "Fairfield, Cabramatta, Canley Vale, Wetherill Park, Smithfield" },
  { label: "Mount Druitt & St Marys", suburbs: "Mount Druitt, St Marys, Rooty Hill, Plumpton, Bidwill" },
  { label: "Campbelltown & Macarthur Region", suburbs: "Campbelltown, Narellan, Gregory Hills, Oran Park, Spring Farm" },
];

function getClusterForWeek(clusters: typeof SYDNEY_CLUSTERS): { label: string; suburbs: string } {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return clusters[weekNumber % clusters.length];
}

interface Agency {
  name: string;
  address: string;
  phone: string;
  website: string;
  principal: string;
  note: string;
}

async function searchAgencies(cluster: { label: string; suburbs: string }): Promise<Agency[]> {
  const prompt = `Search for 10 real estate agencies currently operating in ${cluster.suburbs}, Sydney NSW, Australia.

For each agency return:
- Agency name
- Street address (suburb + postcode)
- Phone number (Australian format, e.g. 02 XXXX XXXX or 04XX XXX XXX)
- Website URL
- Principal agent name (if findable)
- One short note about them (size, speciality, how long established, or community focus)

Focus on agencies that:
1. Are independent or boutique (not just the big chains like Ray White/McGrath head offices)
2. Serve the local community in ${cluster.suburbs}
3. Would benefit from an AI receptionist — small to medium sized teams

Return ONLY a valid JSON array of 10 objects with keys: name, address, phone, website, principal, note. No markdown, no explanation, just raw JSON.`;

  try {
    // Use responses API with web search for live results
    const response = await (openai as any).responses.create({
      model: "gpt-4o",
      tools: [{ type: "web_search_preview" }],
      input: prompt,
    });

    const text = response.output_text ?? "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in response");
    return JSON.parse(jsonMatch[0]) as Agency[];
  } catch (err) {
    logger.warn({ err }, "Web search response failed — falling back to GPT-4o knowledge");

    // Fallback: use regular chat completions without web search
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    });
    const text = completion.choices[0]?.message?.content ?? "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]) as Agency[];
  }
}

function buildProspectEmailHtml(cluster: { label: string; suburbs: string }, agencies: Agency[], dateLabel: string): string {
  const rows = agencies.map((a, i) => `
    <tr style="border-bottom:1px solid #f3f4f6;">
      <td style="padding:16px 20px;vertical-align:top;font-size:22px;font-weight:800;color:#00d1b2;width:36px;">${i + 1}</td>
      <td style="padding:16px 20px;vertical-align:top;">
        <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:4px;">${a.name}</div>
        <div style="font-size:13px;color:#6b7280;margin-bottom:6px;">📍 ${a.address}</div>
        <div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:8px;">
          ${a.phone ? `<a href="tel:${a.phone.replace(/\s/g, "")}" style="font-size:13px;color:#6366f1;text-decoration:none;font-weight:600;">📞 ${a.phone}</a>` : ""}
          ${a.website ? `<a href="${a.website.startsWith("http") ? a.website : "https://" + a.website}" style="font-size:13px;color:#6366f1;text-decoration:none;font-weight:600;">🌐 Website</a>` : ""}
        </div>
        ${a.principal ? `<div style="font-size:13px;color:#374151;margin-bottom:4px;">👤 Principal: <strong>${a.principal}</strong></div>` : ""}
        <div style="font-size:12px;color:#9ca3af;font-style:italic;">${a.note}</div>
      </td>
    </tr>`).join("");

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:680px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

  <!-- Header -->
  <div style="background:#0a0e1a;padding:28px 32px;">
    <div style="color:#00d1b2;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Directive OS · Weekly Prospect List</div>
    <div style="color:#fff;font-size:22px;font-weight:800;margin-bottom:4px;">📋 10 Agencies Ready to Call</div>
    <div style="color:#6b7280;font-size:13px;">${dateLabel} &nbsp;·&nbsp; ${cluster.label}</div>
  </div>

  <!-- Pitch reminder -->
  <div style="background:#f0fffc;border-left:4px solid #00d1b2;padding:16px 24px;margin:0;">
    <div style="font-size:14px;color:#065f46;font-weight:600;margin-bottom:6px;">💡 Your opening line:</div>
    <div style="font-size:14px;color:#064e3b;line-height:1.7;">
      "Hi, I'm Jayson from Directive OS — we built an AI receptionist called Sarah that answers every call for real estate agencies 24/7, in English, Mandarin, Tagalog, and Russian. Takes 2 minutes to explain — is now a good time?"
    </div>
  </div>

  <!-- Table -->
  <table style="width:100%;border-collapse:collapse;">
    ${rows}
  </table>

  <!-- Footer -->
  <div style="padding:20px 32px;background:#f9fafb;border-top:2px solid #e5e7eb;">
    <div style="font-size:12px;color:#9ca3af;line-height:1.8;">
      Next week's list will cover a different area automatically.<br/>
      <a href="https://directiveos.com.au" style="color:#00d1b2;text-decoration:none;">directiveos.com.au</a>
      &nbsp;·&nbsp;
      <a href="mailto:jayson@directiveos.com.au" style="color:#00d1b2;text-decoration:none;">jayson@directiveos.com.au</a>
    </div>
  </div>

</div>`;
}

async function sendProspectEmail(cluster: { label: string; suburbs: string }, agencies: Agency[]): Promise<void> {
  const apiKey = process.env.DOS_RESEND_CFG || process.env.DOS_RESEND_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("Resend key not set — prospect email not sent");
    return;
  }

  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const subject = `📋 This Week's Prospect List — ${cluster.label} (${agencies.length} agencies)`;
  const html = buildProspectEmailHtml(cluster, agencies, dateLabel);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Directive OS | Prospect List <leads@directiveos.com.au>",
        to: OWNER_EMAILS,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      logger.warn({ err, status: res.status }, "Failed to send prospect email");
    } else {
      logger.info({ cluster: cluster.label, count: agencies.length }, "Weekly prospect email sent");
    }
  } catch (err) {
    logger.warn({ err }, "Prospect email send failed");
  }
}

// Monday — Multicultural Sydney suburbs
export async function runWeeklyProspector(): Promise<void> {
  const cluster = getClusterForWeek(SYDNEY_CLUSTERS);
  logger.info({ cluster: cluster.label }, "Running Monday Sydney prospector");

  try {
    const agencies = await searchAgencies(cluster);
    if (agencies.length === 0) {
      logger.warn("Sydney prospector returned 0 agencies — skipping email");
      return;
    }
    await sendProspectEmail(cluster, agencies);
  } catch (err) {
    logger.error({ err }, "Monday Sydney prospector failed");
  }
}

// Wednesday — Jayson's local Western Sydney area
export async function runLocalProspector(): Promise<void> {
  const cluster = getClusterForWeek(LOCAL_CLUSTERS);
  logger.info({ cluster: cluster.label }, "Running Wednesday local prospector");

  try {
    const agencies = await searchAgencies(cluster);
    if (agencies.length === 0) {
      logger.warn("Local prospector returned 0 agencies — skipping email");
      return;
    }
    await sendProspectEmail(cluster, agencies);
  } catch (err) {
    logger.error({ err }, "Wednesday local prospector failed");
  }
}
