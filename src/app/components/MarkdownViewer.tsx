'use client';

import * as Marked from 'marked';

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  let html = markdown || '';
  try {
    const anyMarked: any = Marked as any;
    if (typeof anyMarked.parse === 'function') {
      html = anyMarked.parse(markdown || '');
    } else if (typeof anyMarked.marked === 'function') {
      html = anyMarked.marked(markdown || '');
    }
  } catch {
    html = markdown || '';
  }
  return (
    <article className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
