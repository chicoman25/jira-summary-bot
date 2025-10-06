'use client';

import React, { useCallback, useState } from 'react';

type SummaryResponse = {
  summary?: string;
  error?: string;
  projects?: string[];
  projectCount?: number;
  issueCount?: number;
};

export default function SummaryForm() {
  const [projectA, setProjectA] = useState('');
  const [projectB, setProjectB] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummaryResponse | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const projects = [projectA.trim(), projectB.trim()].filter(Boolean);
    if (!projects.length) {
      setError('Please provide at least one JIRA project key.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects }),
      });

      const data: SummaryResponse = await response.json();
      if (!response.ok) {
        setError(data?.error || `Request failed (${response.status}).`);
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Unexpected error submitting request.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [projectA, projectB]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="projectA">Project A</label>
          <input
            id="projectA"
            type="text"
            value={projectA}
            onChange={e => setProjectA(e.target.value)}
            placeholder="e.g. ABC"
          />
        </div>

        <div>
          <label htmlFor="projectB">Project B</label>
          <input
            id="projectB"
            type="text"
            value={projectB}
            onChange={e => setProjectB(e.target.value)}
            placeholder="e.g. DEF (optional)"
          />
        </div>

        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      {error && (
        <div role="alert">{error}</div>
      )}

      {result?.summary && (
        <div>
          <h2>Summary</h2>
          <pre>{result.summary}</pre>
        </div>
      )}
    </div>
  );
}


