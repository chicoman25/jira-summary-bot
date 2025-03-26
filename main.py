from config import PROJECT_KEYS
from jira_client import get_recent_issues
from summarizer import summarize_issues
from output_writer import write_summary_to_markdown

def main():
    if not PROJECT_KEYS:
        print("⚠️  No project keys configured. Set JIRA_PROJECT_KEYS in your .env file.")
        return

    print(f"🔍 Fetching recent issues for projects: {', '.join(PROJECT_KEYS)}...")
    issues = get_recent_issues(PROJECT_KEYS)

    if issues:
        summary = summarize_issues(issues)
        # print("\n📋 Combined Executive Summary:\n")
        # print(summary)
        md_file = write_summary_to_markdown(summary, f"jira-summary-for-{PROJECT_KEYS}")
        print(f"\n Wrote issue summaries to: {md_file}")
    else:
        print("⚠️  No recent issues found.")

if __name__ == "__main__":
    main()