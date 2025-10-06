import fetch from 'node-fetch';

// Define Jira issue interface
export interface JiraIssue {
  fields: {
    project: {
      key: string;
    };
    summary: string;
    status: {
      name: string;
    };
    assignee?: {
      displayName: string;
    };
  };
}

export async function getRecentIssues(projects: string[], days: number) {
  const jql = `project IN (${projects.join(',')}) AND updated >= -${days}d ORDER BY updated DESC`;

  const url = new URL(`${process.env.JIRA_BASE_URL}/rest/api/3/search/jql`);
  url.searchParams.append('jql', jql);
  url.searchParams.append('maxResults', '50');
  url.searchParams.append('expand', 'changelog');
  url.searchParams.append('fields', 'summary,status,assignee,updated,project');

  const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`JIRA API request failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.issues || [];
}