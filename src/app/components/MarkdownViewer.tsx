'use client';

import * as Marked from 'marked';

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
  const anyMarked: any = Marked as any;
  if (typeof anyMarked.setOptions === 'function') {
    anyMarked.setOptions({ gfm: true, breaks: true, headerIds: false, mangle: false });
  }
  const normalized = preprocessMarkdown(markdown || '');
  let html = normalized;
  try {
    if (typeof anyMarked.parse === 'function') {
      html = anyMarked.parse(normalized);
    } else if (typeof anyMarked.marked === 'function') {
      html = anyMarked.marked(normalized);
    }
  } catch {
    html = normalized;
  }
  return (
    <article className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
