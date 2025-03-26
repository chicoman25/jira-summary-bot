from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def summarize_issues(issues):
    issue_text = "\n".join([
        f"- {i['fields']['summary']} (Status: {i['fields']['status']['name']}, Assignee: {i['fields']['assignee']['displayName'] if i['fields']['assignee'] else 'Unassigned'})"
        for i in issues
    ])

    prompt = f"""
You're an executive at a fast-moving software company. Here's a list of recent JIRA issues from one project. Summarize:

1. Key progress updates
2. Any issues that look blocked or stale
3. Anything worth following up on

- `#` for headings
- `-` for bullet points
- Italics for notes

Here are the issues:
{issue_text}

Output a clean Markdown-formatted summary.

Executive Summary:
"""

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You're a productivity-focused assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5
    )

    return response.choices[0].message.content.strip()