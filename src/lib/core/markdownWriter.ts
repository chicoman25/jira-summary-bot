import * as fs from 'fs';
import * as path from 'path';

export async function writeMarkdown(summary: string) {
    const outputPath = path.join(process.cwd(), 'summaries');
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });
  
    const filename = `jira-summary-${new Date().toISOString().slice(0, 10)}.md`;
    fs.writeFileSync(path.join(outputPath, filename), summary);
}