import { getRecentIssues } from './jiraClient';
import { summarizeWithLLM } from './openaiClient';

export async function getSummary(projects: string[], days: number) {
  const issues = await getRecentIssues(projects, days);
  if (!issues.length) return { summary: 'No recent issues found.' };

  const summary = await summarizeWithLLM(issues);
  return {
    summary,
    projects, 
    projectCount: projects.length,
    issueCount: issues.length,
  };
}