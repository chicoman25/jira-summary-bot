import fetch from 'node-fetch';
import { JiraIssue } from './jiraClient';

export async function summarizeWithLLM(issues: JiraIssue[]) {
  const issueText = issues.map(i => `- [${i.fields.project.key}] ${i.fields.summary} (Status: ${i.fields.status.name}, Assignee: ${i.fields.assignee?.displayName || 'Unassigned'})`).join('\n');

  const prompt = `You're a software engineering executive (EVP) at a fast-moving software company.\n
  You are interested in understanding the status of issues in JIRA with enough detail to help you represent the various teams you work with.\n
  Here's a list of JIRA issues from projects provided in a JQL query. There are 3 key fields in the issue: Status, Assignee, and Project. I would like you to summarize the following:

1. Key progress updates
2. Any issues that look blocked or stale
3. Anything worth following up on or that poses a delivery risk

- '#' for headings
- '-' for bullet points
- Italics for notes

Here are the issues:
${issueText}

Output a clean Markdown-formatted summary

Executive Summary:\n
`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful executive assistant.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API request failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}