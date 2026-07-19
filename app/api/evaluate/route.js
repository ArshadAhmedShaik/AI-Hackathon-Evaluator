import { callAgent } from "@/lib/openai";
import { fetchRepoStats } from "@/lib/github";
import {
  INTAKE_PROMPT,
  DEPTH_PROMPT,
  SCORER_PROMPT,
  FEEDBACK_PROMPT,
} from "@/lib/prompts";

export async function POST(req) {
  try {
    const { text, repoUrl } = await req.json();

    if (!text || text.trim().length < 20) {
      return Response.json(
        { error: "Paste at least a couple sentences describing the submission." },
        { status: 400 }
      );
    }

    // Agent 1: Intake — turn raw text into structured data
    const intake = await callAgent(INTAKE_PROMPT, text);

    // Real, verifiable data — not the LLM guessing
    const repoStats = await fetchRepoStats(repoUrl);

    // Agent 2: Depth check — fed the real repo data
    const depth = await callAgent(
      DEPTH_PROMPT,
      JSON.stringify({ intake, repoStats })
    );

    // Agent 3: Scorer
    const scores = await callAgent(
      SCORER_PROMPT,
      JSON.stringify({ intake, repoStats, depth })
    );

    // Agent 4: Feedback
    const feedback = await callAgent(
      FEEDBACK_PROMPT,
      JSON.stringify({ intake, depth, scores })
    );

    return Response.json({ intake, repoStats, depth, scores, feedback });
  } catch (err) {
    console.error("Evaluation pipeline failed:", err);
    return Response.json(
      { error: "Evaluation failed. Please try again." },
      { status: 500 }
    );
  }
}
