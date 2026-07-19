/**
 * Pulls real, verifiable stats from a public GitHub repo.
 * This is what stops Agent 2 from just "vibing" a depth verdict —
 * it gets actual commit counts, file counts, and test presence to reason over.
 */
export async function fetchRepoStats(repoUrl) {
  if (!repoUrl) return null;

  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(\.git)?\/?$/);
  if (!match) return null;

  const [, owner, repo] = match;
  const headers = process.env.GITHUB_TOKEN
    ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    : {};

  try {
    const [repoRes, commitsRes, contentsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers }),
    ]);

    if (!repoRes.ok) {
      return { error: `Repo not found or private (${repoRes.status})` };
    }

    const repoData = await repoRes.json();
    const commits = await commitsRes.json();
    const contents = await contentsRes.json();

    const fileList = Array.isArray(contents) ? contents.map((f) => f.name) : [];
    const hasTests = fileList.some((name) => /test|spec/i.test(name));
    const hasReadme = fileList.some((name) => /readme/i.test(name));

    return {
      language: repoData.language || "unknown",
      file_count: fileList.length,
      top_level_files: fileList,
      commit_count: Array.isArray(commits) ? commits.length : 0,
      has_tests: hasTests,
      has_readme: hasReadme,
      last_updated: repoData.updated_at,
      stars: repoData.stargazers_count,
    };
  } catch (e) {
    console.error("GitHub fetch failed:", e);
    return { error: "Could not reach GitHub API" };
  }
}
