import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { writeMarkdown } from '../lib/core/markdownWriter';

interface CliOptions {
  projects: string[];
  days: number;
}

function parseCliArgs(args: string[]): CliOptions {
  let projectsArg: string | undefined;
  let daysArg: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--projects=')) {
      projectsArg = arg.split('=')[1];
    } else if (arg === '--projects' || arg === '-p') {
      projectsArg = args[i + 1];
      i++;
    } else if (arg.startsWith('--days=')) {
      daysArg = arg.split('=')[1];
    } else if (arg === '--days' || arg === '-d') {
      daysArg = args[i + 1];
      i++;
    } else if (!arg.startsWith('-') && !projectsArg) {
      projectsArg = arg;
    }
  }

  const projects = (projectsArg || '')
    .split(',')
    .map(p => p.trim())
    .filter(Boolean);

  const parsedDays = daysArg ? parseInt(daysArg, 10) : NaN;
  const days = Number.isFinite(parsedDays) ? parsedDays : 7;

  return { projects, days };
}

async function run() {
  console.log('Running JIRA summary CLI ${process.argv}');
  const { projects, days } = parseCliArgs(process.argv.slice(2));

  if (!projects.length) {
    console.error('Usage: npm run jira:cli -- --projects ABC | ABC,DEF [-d 7]');
    process.exit(1);
  }

  const apiBase = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = `${apiBase}/api/summary`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projects, days })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed (${response.status}): ${errorBody}`);
    }

    const result = await response.json();
    await writeMarkdown((Array.isArray(result?.projects) ? result.projects : projects).join('-'), result.summary);
    console.log(result);
  } catch (error) {
    console.error('Error summarizing JIRA issues via API:', error);
  }
}

run();