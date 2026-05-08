export default async function handler(req, res) {
  // Safe diagnostics: never return secrets, only booleans and HTTP statuses.
  const key =
    process.env.OPENAI_API_KEY ||
    process.env.MICAH_DOS_API_KEY ||
    process.env.MICAH_API_KEY ||
    process.env.DOS_API_KEY ||
    process.env.DOS_MICAH_API_KEY ||
    null;

  const present = {
    DOS_MICAH_API_KEY: Boolean(process.env.DOS_MICAH_API_KEY),
    MICAH_DOS_API_KEY: Boolean(process.env.MICAH_DOS_API_KEY),
    MICAH_API_KEY: Boolean(process.env.MICAH_API_KEY),
    DOS_API_KEY: Boolean(process.env.DOS_API_KEY),
    OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
    resolvedKey: Boolean(key),
  };

  let openai = { ok: false, status: null, error: null };
  let completion = { ok: false, status: null, error: null };
  if (key) {
    try {
      const resp = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: { Authorization: `Bearer ${key}` },
      });
      openai = { ok: resp.ok, status: resp.status, error: resp.ok ? null : await resp.text() };
    } catch (e) {
      openai = { ok: false, status: null, error: String(e?.message || e) };
    }

    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a diagnostics bot. Reply with exactly: OK" },
            { role: "user", content: "ping" },
          ],
          max_tokens: 8,
          temperature: 0,
        }),
      });
      completion = { ok: resp.ok, status: resp.status, error: resp.ok ? null : await resp.text() };
    } catch (e) {
      completion = { ok: false, status: null, error: String(e?.message || e) };
    }
  }

  res.status(200).json({
    ok: true,
    present,
    openai: { ok: openai.ok, status: openai.status, error: openai.error ? String(openai.error).slice(0, 300) : null },
    completion: {
      ok: completion.ok,
      status: completion.status,
      error: completion.error ? String(completion.error).slice(0, 300) : null,
    },
  });
}

