import fetch from 'node-fetch';

export async function summarizeWithLLM(issues: any[]) {
  const issueText = issues.map(i => `- [${i.fields.project.key}] ${i.fields.summary} (Status: ${i.fields.status.name}, Assignee: ${i.fields.assignee?.displayName || 'Unassigned'})`).join('\n');

  const prompt = `Generate a markdown summary for these JIRA issues:\n${issueText}`;

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