export default function HomePage() {
  return (
    <main>
      <h1>JIRA Summary</h1>
      <form method="post" action="/api/summary" target="resultFrame">
        <div>
          <label htmlFor="projectA">Project A</label>
          <input id="projectA" name="projects[]" />
        </div>
        <div>
          <label htmlFor="projectB">Project B</label>
          <input id="projectB" name="projects[]" />
        </div>
        <button type="submit">Submit</button>
      </form>

      <h2>Response</h2>
      <iframe name="resultFrame" style={{ width: '100%', height: 300, border: '1px solid #ccc' }} />
    </main>
  );
}