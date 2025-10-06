import { POST } from './route';

jest.mock('../../../lib/services/summarizer', () => ({
  getSummary: jest.fn(),
}));

const { getSummary } = require('../../../lib/services/summarizer');

function createRequest(body: any) {
  return new Request('http://localhost/api/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function readJson(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

describe('POST /api/summary', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete (process.env as any).JIRA_PROJECT_KEYS;
    delete (process.env as any).JIRA_RECENT_NUM_DAYS;
  });

  it('returns 200 and calls getSummary with provided projects and days', async () => {
    (getSummary as jest.Mock).mockResolvedValue({ summary: 'ok', projects: ['CTI'], projectCount: 1, issueCount: 2 });

    const req = createRequest({ projects: ['CTI'], days: 5 });
    const res = await POST(req as any);

    expect(res.status).toBe(200);
    expect(getSummary).toHaveBeenCalledWith(['CTI'], 5);
    const data = await readJson(res as any);
    expect(data).toEqual({ summary: 'ok', projects: ['CTI'], projectCount: 1, issueCount: 2 });
  });

  it('returns 400 when no projects provided and no env fallback', async () => {
    const req = createRequest({ projects: [], days: 3 });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const data = await readJson(res as any);
    expect(data).toEqual({ error: 'No JIRA project keys provided.' });
  });

  it('uses env fallback for projects and days when body missing/invalid', async () => {
    (getSummary as jest.Mock).mockResolvedValue({ summary: 'env-ok', projects: ['PROJ1','PROJ2'], projectCount: 2, issueCount: 10 });

    process.env.JIRA_PROJECT_KEYS = 'PROJ1, PROJ2';
    process.env.JIRA_RECENT_NUM_DAYS = '9';

    const req = createRequest({});
    const res = await POST(req as any);

    expect(res.status).toBe(200);
    expect(getSummary).toHaveBeenCalledWith(['PROJ1','PROJ2'], 9);
    const data = await readJson(res as any);
    expect(data.summary).toBe('env-ok');
  });

  it('returns 500 when handler throws', async () => {
    (getSummary as jest.Mock).mockRejectedValue(new Error('boom'));
    const req = createRequest({ projects: ['CTI'], days: 2 });
    const res = await POST(req as any);
    expect(res.status).toBe(500);
    const data = await readJson(res as any);
    expect(data).toEqual({ error: 'Internal Server Error' });
  });
});


