'use client';

import React from 'react';
import MarkdownViewer from './MarkdownViewer';

type State = {
  projectsInput: string;
  days: number;
  loading: boolean;
  error: string | null;
  summary: string;
};

export default class SummaryClient extends React.Component<{}, State> {
  state: State = { projectsInput: '', days: 14, loading: false, error: null, summary: '' };

  handleProjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ projectsInput: e.target.value });
  };

  handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 1;
    this.setState({ days: value });
  };

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ error: null, summary: '' });
    const projects = this.state.projectsInput.split(',').map(s => s.trim()).filter(Boolean);
    if (!projects.length) { this.setState({ error: 'Please provide at least one JIRA project key.' }); return; }
    this.setState({ loading: true });
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects, days: this.state.days })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
      this.setState({ summary: String(data?.summary || '') });
    } catch (err: any) {
      this.setState({ error: err?.message || 'Unexpected error submitting request.' });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { projectsInput, days, loading, error, summary } = this.state;
    return (
      <div className="space-y-4">
        <form onSubmit={this.handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
          <div className="space-y-2">
            <label htmlFor="projects" className="block text-sm font-medium">Projects</label>
            <input
              id="projects"
              value={projectsInput}
              onChange={this.handleProjectsChange}
              placeholder="ACD, PE, ACO, ADA, CTI"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="days" className="block text-sm font-medium">Days</label>
            <input
              id="days"
              type="number"
              min={1}
              value={days}
              onChange={this.handleDaysChange}
              className="w-40 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" disabled={loading} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {loading ? 'Generating…' : 'Submit'}
          </button>
        </form>

        {error && <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="mt-2 rounded-md border border-gray-200 bg-white p-4 min-h-40">
          {summary ? <MarkdownViewer markdown={summary} /> : <p className="text-sm text-gray-500">No summary yet.</p>}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!summary}
            onClick={() => {
              if (!summary) return;
              const blob = new Blob([summary], { type: 'text/markdown;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const fileSafeProjects = projectsInput.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9,_-]/g, '') || 'summary';
              const date = new Date().toISOString().slice(0, 10);
              const a = document.createElement('a');
              a.href = url;
              a.download = `jira-summary-${fileSafeProjects}-${date}.md`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Download Markdown
          </button>
        </div>
      </div>
    );
  }
}
