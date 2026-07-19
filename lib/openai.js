const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`;
/**
 * Calls the model with a system prompt (the agent's job) + user input (the data),
 * and returns parsed JSON. Retries once if the model returns malformed JSON.
 * Uses Gemini's free tier — no billing card required.
 */
export async function callAgent(systemPrompt, userInput, retrying = false) {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\nINPUT:\n${userInput}` }] }],
      generationConfig: { temperature: 0.3 },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini API error:", data);
    throw new Error(data?.error?.message || "Gemini API request failed");
  }

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    if (!retrying) {
      // one retry with a stricter nudge before giving up
      return callAgent(
        systemPrompt + "\n\nIMPORTANT: Respond with ONLY the raw JSON object. No markdown, no code fences, no explanation text before or after.",
        userInput,
        true
      );
    }
    console.error("Agent returned invalid JSON after retry:", raw);
    throw new Error("Agent returned invalid JSON");
  }
}
