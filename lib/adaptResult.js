/**
 * The backend (4 agents) and frontend (UI components) were built independently
 * and use different JSON shapes. This function bridges them — call it once
 * right after the fetch resolves, before saving to storage or rendering.
 */
export function adaptBackendResult(raw) {
  const { intake, depth, scores, feedback } = raw;

  const originality = scores?.originality?.score ?? 0;
  const technicalDepth = scores?.technical?.score ?? 0;
  const demoQuality = scores?.demo_readiness?.score ?? 0;
  const impact = scores?.impact?.score ?? 0;
  const overall = Math.round(
    ((originality + technicalDepth + demoQuality + impact) / 4) * 10
  ) / 10;

  return {
    parser: {
      title: intake?.problem_statement || "Untitled Project",
      techStack: intake?.tech_stack || [],
    },
    scores: {
      originality,
      technicalDepth,
      demoQuality,
      impact,
      overall,
    },
    feedback: feedback?.suggestions || [],
    // kept around in case you want to surface these in the UI later
    _depth: depth,
    _justifications: {
      originality: scores?.originality?.justification,
      technicalDepth: scores?.technical?.justification,
      demoQuality: scores?.demo_readiness?.justification,
      impact: scores?.impact?.justification,
    },
  };
}
