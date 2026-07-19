# Panel — AI Hackathon Evaluator

Panel is a multi-agent AI system that evaluates hackathon project submissions
the way a real judging panel would. Paste in a README or pitch description,
and four specialized AI agents work in a chained pipeline to return a
structured, judge-style verdict — a score, flagged gaps, and concrete fixes
you can ship before your deadline.

**Team Rebirth** — Koti Harshini, Powrohitham Samhitha Datta, Shaik Arshad
(SASTRA Deemed University)

---

## How it works

Four agents run in sequence, each one reading the previous agent's
structured output:

1. **Intake Agent** — parses the raw submission into a structured summary
   (problem, solution, tech stack, features, target users)
2. **Depth Checker** — flags whether the project shows real engineering
   depth or is a thin wrapper around a single API call
3. **Rubric Scorer** — scores 1–10 on Originality, Technical Prototype,
   Demo Quality, and Impact
4. **Feedback Coach** — generates 3–5 concrete, actionable fixes plus
   quick wins

No database is used — every evaluation is stateless.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **AI/LLM:** Vercel AI SDK, with support for Grok (xAI), Mistral, Google Gemini,
  and Anthropic Claude
- **Deployment:** Vercel (single deployment, frontend + backend together)

---

## Steps to Run This Project Locally (VS Code)

### 1. Clone the repository
Open a terminal in VS Code (`` Ctrl + ` ``) and run:
```bash
git clone https://github.com/SamhithaDatta/ai-hackathon-evaluator
```

Then open the folder:
```bash
cd ai-hackathon-evaluator
code .
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up your environment variables
In the project root (same folder as `package.json`), copy the example env
file:
```bash
cp .env.local.example .env.local
```

On Windows (PowerShell), use:
```powershell
Copy-Item .env.local.example .env.local
```

### 4. Add your API key
Open `.env.local` in VS Code and add the key for whichever provider the
app is configured to use (check `.env.local.example` for the exact
variable name expected — e.g. `GROK_API_KEY`, `MISTRAL_API_KEY`,
`GEMINI_API_KEY`, or `ANTHROPIC_API_KEY`):
```
GROK_API_KEY=your_actual_key_here
```
Save the file. `.env.local` is already excluded via `.gitignore`, so your
key is never committed.

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see
the app running.

### 6. Try it out
Click **"load sample"** to test with a pre-filled example, or paste your
own project's README/pitch text and click **Evaluate**.

---

## Project Structure

```
src/
  app/
    page.js                 → main UI (input panel + results)
    layout.js                → root layout, fonts, metadata
    globals.css              → design tokens, base styles
    api/evaluate/route.js    → API route that chains the 4 agents
    components/
      AgentRail.jsx           → pipeline progress visualization
      ScoreBar.jsx             → animated rubric score bars
  lib/
    [provider].js             → LLM API call helper
    prompts.js                → the 4 agent system prompts
```

---

## Deployment

The project is deployed on **Vercel**. To deploy your own copy:

1. Push this repo to your own GitHub account
2. Go to [vercel.com](https://vercel.com) → New Project → import your repo
3. In the project's Environment Variables settings, add the same key(s)
   from your `.env.local`
4. Deploy — Vercel will give you a public URL

---

## Challenges Faced

We hit repeated API roadblocks throughout the build — Gemini API models
kept getting deprecated or restricted for new keys mid-development, causing
recurring 404 errors. We tried multiple Gemini keys, then switched to Grok,
then Mistral, before landing on a stable setup. Chained agent calls also
triggered rate-limit (429) errors during testing, solved with automatic
retry logic. Getting all four agents to reliably return clean, parseable
JSON took careful prompt tuning, and the tight 2-day build window meant
prioritizing a working core loop over extra polish.

---

## Learn More

This project was bootstrapped with `create-next-app`. To learn more about
the underlying framework:

- [Next.js Documentation](https://nextjs.org/docs) — features and API
- [Learn Next.js](https://nextjs.org/learn) — interactive tutorial
