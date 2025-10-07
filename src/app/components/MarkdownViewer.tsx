'use client';

import MarkdownIt from 'markdown-it';

function preprocessMarkdown(input: string): string {
  if (!input) return '';
  let s = input.replace(/\r\n/g, '\n');
  // Ensure headings and lists start on their own lines when content is squashed
  s = s.replace(/\s*#\s/g, '\n# ');
  // Move inline hyphen bullets to a new line for proper list parsing
  s = s.replace(/(\S)\s-\s/g, '$1\n- ');
  return s.trim();
}

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true, breaks: true });
  const normalized = preprocessMarkdown(markdown || '');
  let html = md.render(normalized);
  return (
    <article className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
