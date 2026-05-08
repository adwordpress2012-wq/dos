import {
  escapeXml,
  fallbackVoiceGreeting,
  getBusinessByCalledNumber,
  extractEmail,
  extractPhone,
  getMicahOpenAIReply,
} from "../_lib/micah.js";

function isGoodbye(text) {
  const t = String(text || "").toLowerCase();
  return /\b(bye|goodbye|hang up|hangup|see ya|see you|thanks bye|thank you bye)\b/.test(t);
}

function looksLikePropertyOrPriceEnquiry(text) {
  const t = String(text || "").toLowerCase();
  const keywords = [
    "price",
    "price guide",
    "guide",
    "how much",
    "worth",
    "value",
    "rent",
    "rental",
    "tenant",
    "buy",
    "buyer",
    "sell",
    "selling",
    "vendor",
    "offer",
    "auction",
    "appraisal",
    "estimate",
    "bedroom",
    "bathroom",
    "suburb",
    "address",
    "inspection",
    // multilingual price words (basic guardrail triggers)
    "presyo", // Tagalog
    "precio", // Spanish
    "цена", // Russian
    "السعر", // Arabic
    "가격", // Korean
    "giá", // Vietnamese
    "कीमत", // Hindi
  ];
  return keywords.some((k) => t.includes(k));
}

function isAffirmative(text) {
  const t = String(text || "").toLowerCase();
  return /\b(yes|yep|yeah|correct|that'?s right|right|spot on|sure)\b/.test(t);
}

function xml(twimlInner) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n${twimlInner}\n</Response>`;
}

function gather({ say, action }) {
  const safeAction = escapeXml(action);
  return [
    `  <Gather input="speech" speechTimeout="auto" timeout="7" action="${safeAction}" method="POST">`,
    `    <Say voice="alice" language="en-AU">${escapeXml(say)}</Say>`,
    "  </Gather>",
  ].join("\n");
}

function redirect(url) {
  return `  <Redirect method="POST">${escapeXml(url)}</Redirect>`;
}

async function buildHumanLine({ businessName, callerName, callerInput, objective, fallback }) {
  try {
    const ai = await getMicahOpenAIReply({
      businessName,
      callerName,
      channel: "voice",
      callerInput: [
        `Caller said: ${callerInput || "(none)"}`,
        `Task: ${objective}`,
        "Reply with one short natural sentence, and include only one question when a question is required.",
        "Use the caller language when clear; otherwise use natural Australian English.",
        "Do not mention language switching, AI behavior, or internal process.",
      ].join("\n"),
    });
    if (ai && String(ai).trim()) return String(ai).trim();
  } catch (_) {
    // Fall back to deterministic line if OpenAI is unavailable.
  }
  return fallback;
}

async function twimlResponse(req) {
  const toNumber = req.body?.To || req.query?.To || "";
  const callerName = req.body?.CallerName || "";
  const fromNumber = String(req.body?.From || "");
  const speechResult = req.body?.SpeechResult || "";
  const business = getBusinessByCalledNumber(toNumber);
  const tries = Number(req.query?.tries || 0) || 0;
  const step = String(req.query?.step || "enquiry");
  const nameParam = String(req.query?.name || "");
  const enquiryParam = String(req.query?.enquiry || "");
  const phoneParam = String(req.query?.phone || "");
  const emailParam = String(req.query?.email || "");
  const investParam = String(req.query?.invest || "");
  const sellFirstParam = String(req.query?.sellfirst || "");
  const financeParam = String(req.query?.finance || "");

  if (isGoodbye(speechResult)) {
    return xml([
      `  <Say voice="alice" language="en-AU">Thanks so much for calling ${escapeXml(business.name)} — have a ripper day!</Say>`,
      "  <Hangup/>",
    ].join("\n"));
  }

  if (!String(speechResult || "").trim()) {
    if (tries >= 3) {
      return xml([
        `  <Say voice="alice" language="en-AU">No worries at all. I’ll have the team follow up using this caller number so we don’t miss you.</Say>`,
        "  <Hangup/>",
      ].join("\n"));
    }

    const fallbackQuestion =
      step === "name"
        ? "Sorry, I missed that — what’s your name?"
        : step === "mobile"
          ? "Sorry, I missed that — what’s your best mobile number?"
          : step === "email"
            ? "Sorry, I missed that — what’s your email address?"
            : "Sorry, I missed that — what can I help you with today?";

    return xml([
      gather({
        say: fallbackQuestion,
        action: `/api/voice/inbound?step=${encodeURIComponent(step)}&tries=${tries + 1}&name=${encodeURIComponent(nameParam)}&enquiry=${encodeURIComponent(enquiryParam)}`,
      }),
      redirect(`/api/voice/inbound?step=${encodeURIComponent(step)}&tries=${tries + 1}&name=${encodeURIComponent(nameParam)}&enquiry=${encodeURIComponent(enquiryParam)}`),
    ].join("\n"));
  }

  // Step-by-step receptionist flow (more natural + predictable than free-form AI):
  if (step === "name") {
    const capturedName = String(speechResult).trim().split(/\s+/).slice(0, 3).join(" ");
    const say = await buildHumanLine({
      businessName: business.name,
      callerName: capturedName,
      callerInput: speechResult,
      objective: "Acknowledge the caller name and ask what they need help with today.",
      fallback: `Awesome, thanks ${capturedName}! What can I help you out with today?`,
    });
    return xml([
      gather({
        say,
        action: `/api/voice/inbound?step=enquiry&tries=0&name=${encodeURIComponent(capturedName)}`,
      }),
      redirect(`/api/voice/inbound?step=enquiry&tries=1&name=${encodeURIComponent(capturedName)}`),
    ].join("\n"));
  }

  if (step === "enquiry") {
    const capturedEnquiry = String(speechResult).trim();
    const nm = nameParam || callerName || "";

    // NSW compliance / price wall: never quote prices.
    const needsPriceWall = looksLikePropertyOrPriceEnquiry(capturedEnquiry);
    const guardrail = needsPriceWall
      ? "Just so you know, I can’t give a property price or price guide over the phone — NSW underquoting laws are strict — but I can have the principal call you back with the right info."
      : "";

    if (needsPriceWall) {
      const say = [
        "Ah, great question — just so you know, I can’t give out price guides or numbers,",
        "but Jayson, our principal, is the real legend for this and will give you the full scoop.",
        "Just a quick one, are you looking for a place to live yourself, or is this more for investment?",
      ]
        .filter(Boolean)
        .join(" ");
      return xml([
        gather({
          say,
          action: `/api/voice/inbound?step=property2&tries=0&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(capturedEnquiry)}&invest=${encodeURIComponent("")}`,
        }),
        redirect(`/api/voice/inbound?step=property2&tries=1&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(capturedEnquiry)}`),
      ].join("\n"));
    }

    const say = await buildHumanLine({
      businessName: business.name,
      callerName: nm,
      callerInput: capturedEnquiry,
      objective: "Acknowledge the enquiry and ask for the best mobile number.",
      fallback: [nm ? `Great, thanks ${nm}.` : "Great, thanks.", "What’s your best mobile number?"].join(" "),
    });
    return xml([
      gather({
        say,
        action: `/api/voice/inbound?step=mobile&tries=0&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(capturedEnquiry)}`,
      }),
      redirect(`/api/voice/inbound?step=mobile&tries=1&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(capturedEnquiry)}`),
    ].join("\n"));
  }

  if (step === "property2") {
    const nm = nameParam || callerName || "";
    const invest = String(speechResult).trim();
    const say = await buildHumanLine({
      businessName: business.name,
      callerName: nm,
      callerInput: invest,
      objective: "Ask whether they need to sell first before buying.",
      fallback: "Do you have a place you need to sell before you can buy, or are you all set there?",
    });
    return xml([
      gather({
        say,
        action: `/api/voice/inbound?step=property3&tries=0&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&invest=${encodeURIComponent(invest)}`,
      }),
      redirect(`/api/voice/inbound?step=property3&tries=1&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&invest=${encodeURIComponent(invest)}`),
    ].join("\n"));
  }

  if (step === "property3") {
    const nm = nameParam || callerName || "";
    const sellfirst = String(speechResult).trim();
    const say = await buildHumanLine({
      businessName: business.name,
      callerName: nm,
      callerInput: sellfirst,
      objective: "Ask whether finance is already approved or still in progress.",
      fallback: "And have you got your finance sorted, or are you still working through that?",
    });
    return xml([
      gather({
        say,
        action: `/api/voice/inbound?step=finance&tries=0&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&invest=${encodeURIComponent(investParam)}&sellfirst=${encodeURIComponent(sellfirst)}`,
      }),
      redirect(`/api/voice/inbound?step=finance&tries=1&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&invest=${encodeURIComponent(investParam)}&sellfirst=${encodeURIComponent(sellfirst)}`),
    ].join("\n"));
  }

  if (step === "finance") {
    const nm = nameParam || callerName || "";
    const finance = String(speechResult).trim();
    const say = await buildHumanLine({
      businessName: business.name,
      callerName: nm,
      callerInput: finance,
      objective: "Acknowledge finance answer and ask for the best mobile number.",
      fallback: "No worries, thanks for that. What’s your best mobile number?",
    });
    return xml([
      gather({
        say,
        action: `/api/voice/inbound?step=mobile&tries=0&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&invest=${encodeURIComponent(investParam)}&sellfirst=${encodeURIComponent(sellFirstParam)}&finance=${encodeURIComponent(finance)}`,
      }),
      redirect(`/api/voice/inbound?step=mobile&tries=1&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&invest=${encodeURIComponent(investParam)}&sellfirst=${encodeURIComponent(sellFirstParam)}&finance=${encodeURIComponent(finance)}`),
    ].join("\n"));
  }

  if (step === "mobile") {
    const phone = extractPhone(speechResult);
    const nm = nameParam || callerName || "";
    if (!phone) {
      if (tries >= 2) {
        const fallbackPhone = extractPhone(fromNumber) || fromNumber || "";
        if (fallbackPhone) {
          const say = "No worries, I’ll use this caller number so we don’t lose your enquiry. What’s your email address?";
          return xml([
            gather({
              say,
              action: `/api/voice/inbound?step=email&tries=0&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&phone=${encodeURIComponent(fallbackPhone)}&invest=${encodeURIComponent(investParam)}&sellfirst=${encodeURIComponent(sellFirstParam)}&finance=${encodeURIComponent(financeParam)}`,
            }),
            redirect(`/api/voice/inbound?step=email&tries=1&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&phone=${encodeURIComponent(fallbackPhone)}`),
          ].join("\n"));
        }
        return xml([
          `  <Say voice="alice" language="en-AU">Sorry, I’m having a bit of trouble hearing that. Could you say your number one more time slowly?</Say>`,
          `  <Hangup/>`,
        ].join("\n"));
      }
      return xml([
        gather({
          say: "No worries at all — could you say your mobile number one more time?",
          action: `/api/voice/inbound?step=mobile&tries=${tries + 1}&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&invest=${encodeURIComponent(investParam)}&sellfirst=${encodeURIComponent(sellFirstParam)}&finance=${encodeURIComponent(financeParam)}`,
        }),
        redirect(`/api/voice/inbound?step=mobile&tries=${tries + 1}&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&invest=${encodeURIComponent(investParam)}&sellfirst=${encodeURIComponent(sellFirstParam)}&finance=${encodeURIComponent(financeParam)}`),
      ].join("\n"));
    }

    const say = await buildHumanLine({
      businessName: business.name,
      callerName: nm,
      callerInput: speechResult,
      objective: "Acknowledge the number capture and ask for email address.",
      fallback: `Cheers${nm ? `, ${nm}` : ""} — got your number down. And what’s your email address?`,
    });
    return xml([
      gather({
        say,
        action: `/api/voice/inbound?step=email&tries=0&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&phone=${encodeURIComponent(phone)}&invest=${encodeURIComponent(investParam)}&sellfirst=${encodeURIComponent(sellFirstParam)}&finance=${encodeURIComponent(financeParam)}`,
      }),
      redirect(`/api/voice/inbound?step=email&tries=1&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&phone=${encodeURIComponent(phone)}`),
    ].join("\n"));
  }

  if (step === "email") {
    const email = extractEmail(speechResult);
    const nm = nameParam || callerName || "";
    const phone = phoneParam;
    if (!email) {
      if (tries >= 2) {
        return xml([
          gather({
            say: "No worries, we can finish without email for now. Just to confirm, is your name and number correct?",
            action: `/api/voice/inbound?step=confirm&tries=0&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent("")}&invest=${encodeURIComponent(investParam)}&sellfirst=${encodeURIComponent(sellFirstParam)}&finance=${encodeURIComponent(financeParam)}`,
          }),
          redirect(`/api/voice/inbound?step=confirm&tries=1&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent("")}`),
        ].join("\n"));
      }
      return xml([
        gather({
          say: "No worries — could you say your email again? You can say it like john at gmail dot com.",
          action: `/api/voice/inbound?step=email&tries=${tries + 1}&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&phone=${encodeURIComponent(phone)}&invest=${encodeURIComponent(investParam)}&sellfirst=${encodeURIComponent(sellFirstParam)}&finance=${encodeURIComponent(financeParam)}`,
        }),
        redirect(`/api/voice/inbound?step=email&tries=${tries + 1}&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&phone=${encodeURIComponent(phone)}`),
      ].join("\n"));
    }

    const confirmSay = await buildHumanLine({
      businessName: business.name,
      callerName: nm,
      callerInput: speechResult,
      objective: `Confirm captured details exactly: name=${nm || "unknown"}, phone=${phone || "unknown"}, email=${email}. Ask if all details are correct.`,
      fallback: `Perfect${nm ? `, ${nm}` : ""} — just to double-check, I’ve got ${nm || "your name"}, ${phone || "your number"}, and ${email}. That all good?`,
    });
    return xml([
      gather({
        say: confirmSay,
        action: `/api/voice/inbound?step=confirm&tries=0&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&invest=${encodeURIComponent(investParam)}&sellfirst=${encodeURIComponent(sellFirstParam)}&finance=${encodeURIComponent(financeParam)}`,
      }),
      redirect(`/api/voice/inbound?step=confirm&tries=1&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`),
    ].join("\n"));
  }

  if (step === "confirm") {
    const nm = nameParam || callerName || "";
    const phone = phoneParam;
    const email = emailParam;

    if (!isAffirmative(speechResult)) {
      return xml([
        gather({
          say: "No worries — what’s your best mobile number?",
          action: `/api/voice/inbound?step=mobile&tries=0&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}`,
        }),
        redirect(`/api/voice/inbound?step=mobile&tries=1&name=${encodeURIComponent(nm)}&enquiry=${encodeURIComponent(enquiryParam)}`),
      ].join("\n"));
    }

    return xml([
      `  <Say voice="alice" language="en-AU">Jayson will give you a buzz shortly, and you’ll also get a quick summary of our chat sent through.</Say>`,
      `  <Say voice="alice" language="en-AU">It’s been lovely chatting — you’re an absolute legend! Have a ripper day!</Say>`,
      "  <Hangup/>",
    ].join("\n"));
  }

  // Default: AI reply (fallback path)
  let opening = fallbackVoiceGreeting(business.name);
  try {
    const ai = await getMicahOpenAIReply({
      businessName: business.name,
      callerInput: speechResult,
      callerName,
      channel: "voice",
    });
    if (ai) opening = ai;
  } catch (_) {}

  return xml([
    gather({ say: opening, action: "/api/voice/inbound?step=enquiry&tries=0" }),
    redirect("/api/voice/inbound?step=enquiry&tries=1"),
  ].join("\n"));
}

export default function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.status(405).setHeader("Allow", "GET, POST").send("Method Not Allowed");
    return;
  }

  Promise.resolve(twimlResponse(req))
    .then((xml) => {
      res.setHeader("Content-Type", "text/xml");
      res.status(200).send(xml);
    })
    .catch(() => {
      res.setHeader("Content-Type", "text/xml");
      res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-AU">${escapeXml(fallbackVoiceGreeting("Directive OS"))}</Say>
</Response>`);
    });
}
