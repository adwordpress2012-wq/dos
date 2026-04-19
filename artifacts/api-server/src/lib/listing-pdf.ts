import PDFDocument from "pdfkit";

const NAVY  = "#1a2442";
const GOLD  = "#f0b849";
const TEAL  = "#00d1b2";
const GREY  = "#6b7280";
const LGREY = "#f7f7f5";
const WHITE = "#ffffff";
const BLACK = "#111111";

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function fillHex(doc: PDFKit.PDFDocument, hex: string) {
  doc.fillColor(hexToRgb(hex));
}

function strokeHex(doc: PDFKit.PDFDocument, hex: string) {
  doc.strokeColor(hexToRgb(hex));
}

export function generateListingServicesPDF(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0, info: { Title: "Directive OS — Listing Promotion Services", Author: "Directive OS" } });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W = 595.28;
    const M = 48;
    const CW = W - M * 2;

    // ── HEADER ────────────────────────────────────────────────────────────────
    doc.rect(0, 0, W, 120).fill(hexToRgb(NAVY));
    doc.rect(0, 120, W, 4).fill(hexToRgb(GOLD));

    // Logo mark
    doc.rect(M, 28, 36, 36).lineWidth(2).strokeColor(hexToRgb(GOLD)).stroke();
    fillHex(doc, GOLD);
    doc.font("Helvetica-Bold").fontSize(16).text("B", M + 11, 37);

    // Agency name
    fillHex(doc, GOLD);
    doc.font("Helvetica-Bold").fontSize(9).text("DIRECTIVE OS", M + 48, 30, { characterSpacing: 3 });
    fillHex(doc, WHITE);
    doc.font("Helvetica").fontSize(8).text("directiveos.com.au", M + 48, 44, { characterSpacing: 0.5 });

    // Title
    fillHex(doc, WHITE);
    doc.font("Helvetica-Bold").fontSize(22).text("Listing Promotion Services", M + 48, 62);
    fillHex(doc, GOLD);
    doc.font("Helvetica").fontSize(10).text("Promote your properties · Drive more enquiries · 24/7 AI Receptionist", M + 48, 88, { characterSpacing: 0.3 });

    let y = 146;

    // ── INTRO ─────────────────────────────────────────────────────────────────
    fillHex(doc, BLACK);
    doc.font("Helvetica").fontSize(10.5).text(
      "As a Directive OS client, you can feature your latest listings directly on your AI Receptionist landing page. Buyers who scan your for-sale signboard QR code are taken straight to your listing — and Sarah answers their questions 24/7. You supply the content, we handle everything else.",
      M, y, { width: CW, lineGap: 3 }
    );
    y += 68;

    // ── PRICING TABLE ─────────────────────────────────────────────────────────
    fillHex(doc, BLACK);
    doc.font("Helvetica-Bold").fontSize(13).text("Service Pricing", M, y);
    y += 22;

    const services = [
      { name: "Listing Feature — Single Property", price: "$149 AUD", desc: "Feature one property on your landing page. Includes formatted photo, price, specs and description. QR code assets included." },
      { name: "Listing Refresh — Swap / Update",   price: "$99 AUD",  desc: "Update an existing featured listing with a new photo, price or description. Quick turnaround." },
      { name: "Bulk Package — 5 Properties",       price: "$449 AUD", desc: "Feature up to 5 properties with a rotating spotlight. Best for agencies with multiple active listings." },
      { name: "Bulk Package — 10 Properties",      price: "$799 AUD", desc: "Feature up to 10 properties. Best value for high-volume agencies. ~$80 per listing." },
    ];

    for (let i = 0; i < services.length; i++) {
      const s = services[i];
      const rowH = 62;
      const bg = i % 2 === 0 ? hexToRgb(LGREY) : hexToRgb(WHITE);

      doc.rect(M, y, CW, rowH).fill(bg);
      doc.rect(M, y, 4, rowH).fill(hexToRgb(GOLD));

      fillHex(doc, BLACK);
      doc.font("Helvetica-Bold").fontSize(10.5).text(s.name, M + 16, y + 10, { width: CW - 110 });
      doc.font("Helvetica").fontSize(9).fillColor(hexToRgb(GREY)).text(s.desc, M + 16, y + 26, { width: CW - 110, lineGap: 1 });

      // Price badge
      doc.rect(M + CW - 90, y + 14, 82, 28).fill(hexToRgb(NAVY));
      fillHex(doc, GOLD);
      doc.font("Helvetica-Bold").fontSize(12).text(s.price, M + CW - 90, y + 21, { width: 82, align: "center" });

      y += rowH + 4;
    }

    y += 16;

    // ── WHAT YOU PROVIDE ──────────────────────────────────────────────────────
    fillHex(doc, BLACK);
    doc.font("Helvetica-Bold").fontSize(13).text("What You Need to Provide", M, y);
    y += 22;

    const provide = [
      "High-resolution property photos (JPG or PNG, minimum 1MB each)",
      "Full property address",
      "Asking price or 'Contact Agent'",
      "Bedroom / Bathroom / Car space / Land size details",
      "Short property description (2–4 sentences) — your words, your tone",
      "Open home date and time (if applicable)",
    ];

    for (const item of provide) {
      doc.rect(M, y + 3, 6, 6).fill(hexToRgb(GOLD));
      fillHex(doc, BLACK);
      doc.font("Helvetica").fontSize(10).text(item, M + 16, y, { width: CW - 16, lineGap: 1 });
      y += 18;
    }

    y += 16;

    // ── PROOFING PROCESS ──────────────────────────────────────────────────────
    doc.rect(M, y, CW, 2).fill(hexToRgb(LGREY));
    y += 12;

    fillHex(doc, BLACK);
    doc.font("Helvetica-Bold").fontSize(13).text("How It Works — Step by Step", M, y);
    y += 22;

    const steps = [
      ["Submit Your Content", "Send your listing details to hello@directiveos.com.au or via your account manager."],
      ["We Build Your Listing Page", "We format and design your listing within 2 business days of receiving all content."],
      ["You Approve the Proof", "We send you a preview link. Nothing goes live until you reply confirming approval. Check everything carefully."],
      ["We Publish", "Your listing goes live on your landing page within 24 hours of your approval. QR code assets are ready to use."],
    ];

    for (let i = 0; i < steps.length; i++) {
      const [title, body] = steps[i];
      // Step circle
      doc.circle(M + 12, y + 8, 12).fill(hexToRgb(TEAL));
      fillHex(doc, WHITE);
      doc.font("Helvetica-Bold").fontSize(10).text(String(i + 1), M + 8, y + 3);

      fillHex(doc, BLACK);
      doc.font("Helvetica-Bold").fontSize(10.5).text(title as string, M + 32, y - 1);
      doc.font("Helvetica").fontSize(9).fillColor(hexToRgb(GREY)).text(body as string, M + 32, y + 13, { width: CW - 36, lineGap: 1 });
      y += 42;
    }

    y += 8;

    // ── LIABILITY DISCLAIMER ──────────────────────────────────────────────────
    doc.rect(M, y, CW, 72).fill(hexToRgb("#fff8e7"));
    doc.rect(M, y, 4, 72).fill(hexToRgb(GOLD));

    fillHex(doc, BLACK);
    doc.font("Helvetica-Bold").fontSize(10).text("Important — Content Accuracy", M + 14, y + 10);
    doc.font("Helvetica").fontSize(9).fillColor(hexToRgb(GREY)).text(
      "You are responsible for the accuracy of all listing content provided, including property descriptions, pricing, addresses and photos. Directive OS publishes content exactly as supplied and accepts no liability for errors, omissions or inaccuracies in client-supplied material.\n\nPlease review your proof carefully before approving — once published, correction fees may apply.",
      M + 14, y + 26, { width: CW - 28, lineGap: 2 }
    );
    y += 82;

    // ── HOW TO ORDER ─────────────────────────────────────────────────────────
    fillHex(doc, BLACK);
    doc.font("Helvetica-Bold").fontSize(11).text("How to Order", M, y);
    y += 16;
    doc.font("Helvetica").fontSize(10).fillColor(hexToRgb(GREY)).text(
      "Simply email your listing content and chosen package to hello@directiveos.com.au with the subject line 'Listing Update - [Your Agency Name]'. Your account manager will confirm receipt and process your order.",
      M, y, { width: CW, lineGap: 2 }
    );

    // ── FOOTER ───────────────────────────────────────────────────────────────
    const footerY = 790;
    doc.rect(0, footerY, W, 52).fill(hexToRgb(NAVY));
    doc.rect(0, footerY, W, 3).fill(hexToRgb(GOLD));

    fillHex(doc, WHITE);
    doc.font("Helvetica-Bold").fontSize(9).text("Directive OS", M, footerY + 10);
    fillHex(doc, "#9ca3af");
    doc.font("Helvetica").fontSize(8).text("ABN 87 754 544 171  ·  hello@directiveos.com.au  ·  directiveos.com.au  ·  Prices inc. GST", M, footerY + 24);

    fillHex(doc, GOLD);
    doc.font("Helvetica-Bold").fontSize(8).text("Listing Promotion Services — 2025", M, footerY + 36, { width: CW, align: "right" });

    doc.end();
  });
}
