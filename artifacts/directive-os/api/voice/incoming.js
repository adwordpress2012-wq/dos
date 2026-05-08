import {
  escapeXml,
  fallbackVoiceGreeting,
  getBusinessByCalledNumber,
} from "../_lib/micah.js";

async function twimlResponse(req) {
  const toNumber = req.body?.To || req.query?.To || "";
  const callerName = req.body?.CallerName || "";
  const business = getBusinessByCalledNumber(toNumber);

  // First turn should be simple + natural: ask for name only.
  // This reduces caller hesitation and prevents Twilio Gather timeouts.
  const opening = `G'day! You’ve reached ${business.name} — I’m Micah. Who am I having the pleasure of chatting with today?`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" speechTimeout="auto" timeout="7" action="/api/voice/inbound?step=name&amp;tries=0" method="POST">
    <Say voice="alice" language="en-AU">${escapeXml(opening)}</Say>
  </Gather>
  <Say voice="alice" language="en-AU">Sorry, I missed that — what’s your name?</Say>
  <Redirect method="POST">/api/voice/inbound?step=name&amp;tries=1</Redirect>
</Response>`;
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
