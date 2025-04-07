import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as jira from '../lib/services/jiraClient';


async function run() {
  const projects = process.env.JIRA_PROJECT_KEYS?.split(',') || ['ABC'];
  const days = parseInt(process.env.JIRA_RECENT_NUM_DAYS || '7');

  try {
    const issues = await jira.getRecentIssues(projects, days);
    console.log(`Fetched ${issues.length} issues:`);
    issues.forEach((i: jira.JiraIssue, index: number) => {
      console.log(`${index + 1}. [${i.fields.project.key}] ${i.fields.summary}`);
    });
  } catch (error) {
    console.error('Error fetching JIRA issues:', error);
  }
}

run();