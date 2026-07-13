// Minimal OpenAI Chat Completions client (fetch-based — no SDK dependency).
// Used only by the PrepNext Assistant route. The API key stays server-side.

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export function hasOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY);
}

/**
 * Call OpenAI chat completions and return the assistant's text reply.
 * @param {Array<{role: string, content: string}>} messages
 * @param {{ temperature?: number, maxTokens?: number, signal?: AbortSignal }} opts
 */
export async function chatComplete(messages, { temperature = 0.3, maxTokens = 500, signal } = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw Object.assign(new Error("OPENAI_API_KEY missing"), { status: 503 });

  const resp = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature,
      max_tokens: maxTokens,
      messages,
    }),
    signal,
  });

  if (!resp.ok) {
    let detail = "";
    try {
      const j = await resp.json();
      detail = j?.error?.message || "";
    } catch {
      /* ignore */
    }
    // Never surface the upstream body verbatim to clients; log-friendly here.
    const err = new Error(`OpenAI request failed (${resp.status})${detail ? ": " + detail : ""}`);
    err.status = resp.status === 401 ? 500 : 502; // 401 = our key problem, hide as 500
    throw err;
  }

  const data = await resp.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error("OpenAI returned an empty reply");
  return reply;
}
