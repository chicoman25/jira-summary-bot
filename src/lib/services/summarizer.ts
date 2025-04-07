import { getRecentIssues } from './jiraClient';
import { summarizeWithLLM } from './openaiClient';
import { writeMarkdown } from '../core/markdownWriter';

export async function getSummary(projects: string[], days: number) {
  const issues = await getRecentIssues(projects, days);
  if (!issues.length) return { summary: 'No recent issues found.' };

  const summary = await summarizeWithLLM(issues);
  await writeMarkdown(summary);
  return {
    summary,
    projectCount: projects.length,
    issueCount: issues.length,
  };
}