import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MarkdownViewer from './MarkdownViewer';

describe('MarkdownViewer', () => {
  it('renders basic markdown into styled HTML', () => {
    const markdown = `# Title\n\n- Item 1\n- Item 2\n\nSome **bold** and _italic_ text.\n\n\`code\``;
    const html = renderToStaticMarkup(React.createElement(MarkdownViewer, { markdown }));

    // Should wrap with Tailwind Typography classes
    expect(html).toContain('class="prose');

    // Should contain some semantic HTML produced by markdown
    expect(/<h1[\s\S]*?>\s*Title\s*<\/h1>/.test(html)).toBe(true);
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>Item 1</li>');
    expect(html).toContain('<li>Item 2</li>');
    expect(html).toMatch(/<strong>|<em>|<code>/);
  });

  it('renders the markdown fixture from summaries correctly', () => {
    const fixturePath = path.resolve(process.cwd(), 'summaries/markdown-fixture.md');
    const markdown = fs.readFileSync(fixturePath, 'utf8');
    const html = renderToStaticMarkup(React.createElement(MarkdownViewer, { markdown }));

    expect(html).toContain('class="prose');
    expect(/<h1[\s\S]*?>\s*Executive Summary\s*<\/h1>/.test(html)).toBe(true);
    expect(html).toContain('<ul>');
    expect(html).toMatch(/<li>[\s\S]*?<\/li>/);
  });
});


