import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getSummary } from '../lib/services/summarizer';

async function run() {
  const projects = process.env.JIRA_PROJECT_KEYS?.split(',') || ['ABC'];
  const days = parseInt(process.env.JIRA_RECENT_NUM_DAYS || '7');

  try {
    const summary = await getSummary(projects, days);
    console.log(summary);
  } catch (error) {
    console.error('Error summarizing JIRA issues:', error);
  }
}

run();