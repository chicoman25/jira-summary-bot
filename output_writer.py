import os
from datetime import datetime

OUTPUT_DIR = "summaries"

def ensure_output_dir():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

def write_summary_to_markdown(summary_text, prefix="jira-summary", date=None):
    ensure_output_dir()
    date_str = date or datetime.now().strftime("%Y-%m-%d")
    filename = f"{prefix}-{date_str}.md"
    filepath = os.path.join(OUTPUT_DIR, filename)

    with open(filepath, "w") as f:
        f.write("# Engineering Executive Summary\n\n")
        f.write(f"_Generated on {date_str}_\n\n")
        f.write(summary_text.strip())

    print(f"✅ Summary written to: {filepath}")
    return filepath