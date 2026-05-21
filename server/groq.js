import Groq from "groq-sdk";

let _client = null;
function client() {
  if (_client) return _client;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY missing in server/.env");
  _client = new Groq({ apiKey });
  return _client;
}

export const MODEL = "openai/gpt-oss-120b";

/**
 * Call Groq with strict JSON mode and a single retry at lower temperature on failure.
 * Returns parsed JSON.
 */
export async function generateJSON(prompt, { temperature = 0.7, maxTokens = 65536 } = {}) {
  const attempt = async (temp) =>
    client().chat.completions.create({
      model: MODEL,
      temperature: temp,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

  let raw;
  try {
    const resp = await attempt(temperature);
    raw = resp.choices?.[0]?.message?.content ?? "";
    return JSON.parse(raw);
  } catch (err) {
    console.warn("[groq] first attempt failed:", err?.message);
    try {
      const resp = await attempt(0.3);
      raw = resp.choices?.[0]?.message?.content ?? "";
      return JSON.parse(raw);
    } catch (err2) {
      const e = new Error("Groq generation failed after retry");
      e.cause = err2;
      e.lastRaw = raw;
      throw e;
    }
  }
}

export function validateShape(obj, requiredKeys) {
  if (!obj || typeof obj !== "object") return false;
  return requiredKeys.every((k) => k in obj);
}
