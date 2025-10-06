import SummaryClient from './components/SummaryClient';

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">JIRA Summary</h1>
      <SummaryClient />
    </main>
  );
}