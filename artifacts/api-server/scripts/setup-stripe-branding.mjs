/**
 * One-time script: Upload Directive OS logo to Stripe and configure account branding.
 * Uses native Node.js FormData + fetch (Node 18+).
 * Run with: node artifacts/api-server/scripts/setup-stripe-branding.mjs
 */

import Stripe from "stripe";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const stripeKey = process.env.STRIPE_KEY_ACTIVE;

if (!stripeKey || !stripeKey.startsWith("sk_live_")) {
  console.error("❌  STRIPE_KEY_ACTIVE must be a live key (sk_live_...). Aborting.");
  process.exit(1);
}

const stripe = new Stripe(stripeKey, { apiVersion: "2025-03-31.basil" });
const authHeader = `Bearer ${stripeKey}`;

async function uploadToStripe(buffer, filename, purpose) {
  const form = new FormData();
  const blob = new Blob([buffer], { type: "image/png" });
  form.append("file", blob, filename);
  form.append("purpose", purpose);

  const res = await fetch("https://files.stripe.com/v1/files", {
    method: "POST",
    headers: { Authorization: authHeader },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`File upload failed (${res.status}): ${err}`);
  }
  return res.json();
}

async function run() {
  console.log("🎨  Configuring Stripe account branding for Directive OS...\n");

  // Logo already uploaded in a previous run — reuse the file ID
  const logoFileId = "file_1TLWyL9aGsy5kFWkWylNtnaO";
  console.log(`✅  Logo ready — ${logoFileId}`);

  // ── Upload square icon (1:1 required by Stripe) ──────────────────────────────
  const iconBuffer = readFileSync("/tmp/logo-stripe-icon.png");
  console.log("📤  Uploading square icon...");
  const iconFile = await uploadToStripe(iconBuffer, "directive-os-icon.png", "business_icon");
  console.log(`✅  Icon uploaded — ${iconFile.id}`);

  // ── 3. Set account branding + business profile via REST API ─────────────────
  console.log("🏷   Applying branding to Stripe account...");
  const params = new URLSearchParams({
    "settings[branding][logo]": logoFileId,
    "settings[branding][icon]": iconFile.id,
    "settings[branding][primary_color]": "#00d1b2",
    "settings[branding][secondary_color]": "#0a0e1a",
    "business_profile[name]": "Directive OS Pty Ltd",
    "business_profile[url]": "https://directiveos.com.au",
    "business_profile[support_email]": "billing@directiveos.com.au",
  });

  const acctRes = await fetch("https://api.stripe.com/v1/account", {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!acctRes.ok) {
    const errText = await acctRes.text();
    throw new Error(`Account update failed (${acctRes.status}): ${errText}`);
  }
  console.log("✅  Account branding applied");

  console.log("\n✨  Stripe branding fully configured:");
  console.log("   Logo     :", logoFileId);
  console.log("   Icon     :", iconFile.id);
  console.log("   Colours  : #00d1b2 teal / #0a0e1a navy");
  console.log("   Business : Directive OS Pty Ltd | directiveos.com.au\n");
  console.log("📋  One manual step remaining:");
  console.log("    Stripe Dashboard → Settings → Billing → Invoice & quote settings → Footer");
  console.log('    Paste: "ABN 87 754 544 171  |  GST Registered  |  Directive OS Pty Ltd  |  directiveos.com.au"\n');
  console.log("✅  Done!");
}

run().catch(err => {
  console.error("❌  Error:", err.message ?? err);
  process.exit(1);
});
