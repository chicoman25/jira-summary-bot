import * as fs from 'fs';
import * as path from 'path';

export async function writeMarkdown(title: string, summary: string) {
    const SUMMARY_DIR = process.env.SUMMARY_DIR || 'summaries';
    const outputPath = path.join(process.cwd(), SUMMARY_DIR);
    
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });
  
    const filename = `jira-summary-${title}-${new Date().toISOString().slice(0, 10)}.md`;
    fs.writeFileSync(path.join(outputPath, filename), summary);
}