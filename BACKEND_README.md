# Backend — Person 1's part

## Setup
1. `cp .env.local.example .env.local`
2. Add your real `OPENAI_API_KEY` (GitHub token is optional)
3. `npm install`
4. `npm run dev`

## Files
- `lib/openai.js` — the one reusable function every agent calls. Handles JSON parsing + one retry if the model returns malformed JSON.
- `lib/github.js` — pulls real repo stats (commit count, file count, has_tests, has_readme) from the public GitHub API. This is what stops Agent 2 from just guessing.
- `lib/prompts.js` — all 4 agent system prompts in one place. Edit these to tune quality.
- `app/api/evaluate/route.js` — chains all 4 agents: Intake → Depth → Scorer → Feedback.

## Testing without the UI
```bash
curl -X POST http://localhost:3000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{"text":"We built an AI study coach that generates quizzes from lecture notes using RAG","repoUrl":"https://github.com/vercel/next.js"}'
```

## Response shape (give this to Person 2)
```json
{
  "intake": { "problem_statement": "", "tech_stack": [], "claimed_features": [] },
  "repoStats": { "language": "", "file_count": 0, "top_level_files": [], "commit_count": 0, "has_tests": false, "has_readme": false, "last_updated": "", "stars": 0 },
  "depth": { "depth_verdict": "shallow|moderate|deep", "evidence": [], "is_api_wrapper_risk": false },
  "scores": {
    "originality": { "score": 0, "justification": "" },
    "technical": { "score": 0, "justification": "" },
    "demo_readiness": { "score": 0, "justification": "" },
    "impact": { "score": 0, "justification": "" }
  },
  "feedback": { "suggestions": [] }
}
```

## Tomorrow (July 18) checklist
- [ ] Run the same input twice — if scores drift more than ~1 point, add few-shot examples to `SCORER_PROMPT` in `lib/prompts.js` (template already sketched at the bottom of that file)
- [ ] Test with a genuinely shallow repo and a genuinely solid one — confirm the depth verdict actually differs
- [ ] Pre-run and save one full response as a JSON file — use it as a live-demo fallback if the API is slow/rate-limited during judging
