export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">JIRA Summary</h1>
      <p className="text-sm text-gray-600 mb-6">Enter comma-separated project keys and number of days.</p>

      <form method="post" action="/api/summary" target="resultFrame" className="space-y-4 bg-white p-4 rounded-lg shadow">
        <div className="space-y-2">
          <label htmlFor="projects" className="block text-sm font-medium">Projects</label>
          <input
            id="projects"
            name="projects[]"
            placeholder="ABC, DEF, GHI"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="days" className="block text-sm font-medium">Days</label>
          <input
            id="days"
            name="days"
            type="number"
            min={1}
            defaultValue={7}
            className="w-40 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button type="submit" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Submit</button>
      </form>

      <div className="mt-6 space-y-2">
        <h2 className="text-lg font-semibold">Response</h2>
        <iframe name="resultFrame" className="w-full h-80 rounded-md border border-gray-300 bg-white" />
      </div>
    </main>
  );
}