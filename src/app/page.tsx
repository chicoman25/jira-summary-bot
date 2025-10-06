import MarkdownViewer from './components/MarkdownViewer';

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">JIRA Summary</h1>
      <p className="text-sm text-gray-600 mb-6">Enter comma-separated project keys and number of days.</p>

      <form id="summaryForm" className="space-y-4 bg-white p-4 rounded-lg shadow">
        <div className="space-y-2">
          <label htmlFor="projects" className="block text-sm font-medium">Projects</label>
          <input
            id="projects"
            name="projects"
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

      <div id="spinner" className="mt-4 hidden items-center gap-2 text-blue-600">
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="text-sm">Generating summary…</span>
      </div>

      <div className="mt-6 space-y-2">
        <h2 className="text-lg font-semibold">Response</h2>
        <div id="errorBox" className="hidden rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"></div>
        <div id="summaryOutput" className="prose prose-slate max-w-none rounded-md border border-gray-200 bg-white p-4"></div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            function onReady(fn){ if(document.readyState!=='loading'){ fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }
            onReady(function(){
              var form = document.getElementById('summaryForm');
              var spinner = document.getElementById('spinner');
              var errorBox = document.getElementById('errorBox');
              var output = document.getElementById('summaryOutput');
              if(!form || !spinner || !output) return;
              form.addEventListener('submit', async function(e){
                try { e.preventDefault(); } catch(_) {}
                if(errorBox){ errorBox.classList.add('hidden'); errorBox.textContent=''; }
                output.textContent=''; output.innerHTML='';
                spinner.classList.remove('hidden'); spinner.classList.add('flex');
                try {
                  var projectsValue = (document.getElementById('projects')||{}).value||'';
                  var daysValue = (document.getElementById('days')||{}).value||'';
                  var projects = projectsValue.split(',').map(function(s){ return s.trim(); }).filter(Boolean);
                  var days = Number(daysValue)||7;
                  if(projects.length===0){ throw new Error('Please provide at least one JIRA project key.'); }
                  var res = await fetch('/api/summary', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projects: projects, days: days }) });
                  var data = await res.json();
                  if(!res.ok){ throw new Error(data && data.error ? data.error : ('Request failed ('+res.status+')')); }
                  var summary = (data && data.summary) ? String(data.summary) : '';
                  if(window.marked && window.marked.parse){ output.innerHTML = window.marked.parse(summary); }
                  else { output.textContent = summary; }
                } catch(err){
                  if(errorBox){ errorBox.textContent = String(err && err.message ? err.message : err); errorBox.classList.remove('hidden'); }
                } finally {
                  spinner.classList.add('hidden'); spinner.classList.remove('flex');
                }
              });
            });
          })();
        `}}
      />
    </main>
  );
}