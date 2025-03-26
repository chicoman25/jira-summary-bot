import requests
from config import JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN

def get_recent_issues(project_keys, days=7, max_results=50):
    url = f"{JIRA_BASE_URL}/rest/api/3/search"
    headers = {
        "Accept": "application/json"
    }
    auth = (JIRA_EMAIL, JIRA_API_TOKEN)

    project_list = ", ".join(project_keys)
    jql = f'project IN ({project_list}) AND updated >= -{days}d ORDER BY updated DESC'

    params = {
        "jql": jql,
        "maxResults": max_results,
        "fields": "summary,status,assignee,updated,project"
    }

    response = requests.get(url, headers=headers, auth=auth, params=params)
    response.raise_for_status()
    return response.json().get("issues", [])