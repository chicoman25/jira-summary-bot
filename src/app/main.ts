import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getSummary } from '../lib/services/summarizer';
import { getBackflowIssuesForCurrentYear } from '../lib/services/jiraClient';
import { analyzeBackwardsWorkflow } from '../lib/services/backwardsWorkflowAnalyzer';
import { generateBackwardsWorkflowReport } from '../lib/services/workflowReportGenerator';

async function runSummary(projects: string[], days: number) {


  try {
    const summary = await getSummary(projects, days, 200);
    console.log(summary);
  } catch (error) {
    console.error('Error summarizing JIRA issues:', error);
  }
}

async function runBackwardsWorkflowAnalysis(projects: string[]) {

  const fromStatus = process.env.JIRA_BACKWARDS_FROM_STATUS || 'Done';
  const toStatuses = process.env.JIRA_BACKWARDS_TO_STATUSES?.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')) || ['Ready for Adoption', 'In Progress', 'Code Review'];

  try {
    console.log('Fetching JIRA issues from target projects for backwards workflow analysis...');
    const issues = await getBackflowIssuesForCurrentYear(projects, fromStatus, toStatuses, 2000);
    console.log(`Found ${issues.length} issues`);

    console.log('Analyzing backwards workflow transitions...');
    const backwardsTransitions = analyzeBackwardsWorkflow(issues);
    console.log(`Found ${backwardsTransitions.length} backwards workflow transitions`);

    console.log('Generating report...');
    const report = generateBackwardsWorkflowReport(projects, backwardsTransitions);
    console.log('\n' + report);
  } catch (error) {
    console.error('Error analyzing backwards workflow:', error);
  }
}

async function run() {
  const command = process.argv[2];

  const projects = process.env.JIRA_PROJECT_KEYS?.split(',') || ['ABC'];
  const days = parseInt(process.env.JIRA_RECENT_NUM_DAYS || '7');

  switch (command) {
    case 'backwards-workflow':
      await runBackwardsWorkflowAnalysis(projects);
      break;
    case 'summary':
    default:
      await runSummary(projects, days);
      break;
  }
}

run();