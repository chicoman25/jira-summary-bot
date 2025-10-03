import fetch from 'node-fetch';

// Define Jira issue interface
export interface JiraIssue {
  key: string;
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
    created: string;
    updated: string;
  };
  changelog?: {
    histories: JiraChangelogHistory[];
  };
}

export interface JiraChangelogHistory {
  id: string;
  created: string;
  items: JiraChangelogItem[];
}

export interface JiraChangelogItem {
  field: string;
  fromString: string;
  toString: string;
}

export async function getRecentIssues(projects: string[], days: number, maxResults: number = 50) {
  const jql = `project IN (${projects.join(',')}) AND updated >= -${days}d ORDER BY updated DESC`;

  const url = new URL(`${process.env.JIRA_BASE_URL}/rest/api/3/search`);
  url.searchParams.append('jql', jql);
  url.searchParams.append('maxResults', maxResults.toString());
  url.searchParams.append('fields', 'summary,status,assignee,updated,project');
  url.searchParams.append('expand', 'changelog');


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

export async function getBackflowIssuesForCurrentYear(projects: string[], fromStatus: string, toStatuses: string[], maxResults: number = 1000) {
  const jql = `project IN (${projects.join(',')}) AND status changed 
    FROM "${fromStatus}" TO (${toStatuses.map(status => `"${status}"`).join(',')}) 
    DURING (startOfYear(), now()) 
    ORDER BY updated DESC`

  console.log(`Running JQL: ${jql}`);

  const url = new URL(`${process.env.JIRA_BASE_URL}/rest/api/3/search`);
  url.searchParams.append('jql', jql);
  url.searchParams.append('maxResults', maxResults.toString());
  url.searchParams.append('fields', 'summary,status,assignee,created,updated,project');
  url.searchParams.append('expand', 'changelog');

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