import { NextResponse } from 'next/server';
import { getSummary } from '../../../lib/services/summarizer';

export async function POST(request: Request) {
  try {
    let body: any = {};
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json().catch(() => ({} as any));
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const projectsFromForm = form.getAll('projects[]');
      body.projects = projectsFromForm.length ? projectsFromForm : undefined;
      const daysFromForm = form.get('days');
      if (daysFromForm) body.days = Number(daysFromForm);
    }

    const projectsFromBody: unknown = body?.projects;
    const projects = Array.isArray(projectsFromBody)
      ? (projectsFromBody as unknown[]).map(String).map(p => p.trim()).filter(Boolean)
      : (process.env.JIRA_PROJECT_KEYS?.split(',').map(p => p.trim()).filter(Boolean) || []);

    const daysFromBody: unknown = body?.days;
    const days = (typeof daysFromBody === 'number' && !Number.isNaN(daysFromBody))
      ? daysFromBody
      : parseInt(process.env.JIRA_RECENT_NUM_DAYS || '7');

    if (!projects.length) {
      return NextResponse.json({ error: 'No JIRA project keys provided.' }, { status: 400 });
    }

    const result = await getSummary(projects, days);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error handling summary POST:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


