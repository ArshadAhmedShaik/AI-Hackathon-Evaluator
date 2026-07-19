const MISTRAL_KEY = process.env.MISTRAL_API_KEY;

/**
 * Calls the Mistral API (OpenAI-compatible) with a system prompt (the agent's job)
 * + user input (the data), and returns parsed JSON.
 * Retries once if the model returns malformed JSON.
 */
export async function callAgent(systemPrompt, userInput, retrying = false) {
  if (!MISTRAL_KEY) {
    throw new Error("MISTRAL_API_KEY environment variable is not defined. Please add it to your environment/Vercel project variables.");
  }

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${MISTRAL_KEY}`
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Mistral API error:", data);
    if (response.status === 429) {
      throw new Error("Mistral API rate limit exceeded. Please wait a moment before trying again.");
    }
    throw new Error(data?.message || data?.error?.message || "Mistral API request failed");
  }

  const raw = data.choices?.[0]?.message?.content || "";
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

