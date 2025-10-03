

# JIRA Summary Bot

A CLI tool for analyzing JIRA tickets and generating workflow reports.

## Features

- **Issue Summarization**: Get AI-powered summaries of recent JIRA issues
- **Backwards Workflow Analysis**: Identify tickets that moved backwards in the workflow from "In DA Review" to earlier statuses

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file with your JIRA credentials:
```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@domain.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEYS=PROJECT1,PROJECT2
JIRA_RECENT_NUM_DAYS=7
OPENAI_API_KEY=your-openai-api-key
```

## Commands

### Issue Summary
Generate AI-powered summaries of recent JIRA issues:
```bash
npm run jira:cli summary
```

### Backwards Workflow Analysis
Analyze tickets that moved backwards from "In DA Review" to earlier workflow statuses:
```bash
npm run jira:cli backwards-workflow
```

This command analyzes tickets from projects: ACD, ADA, ADV, RPSC, ACO, ADE, PE, ACDX, DEP, TPG for the current year (2025) and identifies transitions from "In DA Review" to:
- "Ready for Adoption"
- "Ad Code Development In Progress" 
- "Code Review"

The report includes:
- Monthly breakdown of backwards transitions
- Project-level statistics
- Individual ticket details with transition dates
- Summary metrics showing workflow bottlenecks

## Project Structure

```
src/
├── app/
│   └── main.ts             # CLI entry point
├── lib/
│   └── services/
│       ├── jiraClient.ts                    # JIRA API integration
│       ├── openaiClient.ts                  # OpenAI API integration  
│       ├── summarizer.ts                    # Issue summarization logic
│       ├── backwardsWorkflowAnalyzer.ts     # Backwards workflow detection
│       └── workflowReportGenerator.ts       # Report generation
└── types/                  # TypeScript type definitions
```

## Development

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests