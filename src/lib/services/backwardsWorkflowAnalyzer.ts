import { JiraIssue, JiraChangelogHistory, JiraChangelogItem } from './jiraClient';

export interface BackwardsTransitionEvent {
  ticketKey: string;
  ticketSummary: string;
  projectKey: string;
  transitionDate: string;
  fromStatus: string;
  toStatus: string;
}

export interface MonthlyBackwardsReport {
  month: string;
  events: BackwardsTransitionEvent[];
  totalCount: number;
}

const TARGET_FROM_STATUS = 'In DA Review';
const TARGET_TO_STATUSES = [
  'Ready for Adoption',
  'Ad Code Development In Progress', 
  'Code Review'
];

export function analyzeBackwardsWorkflow(issues: JiraIssue[]): BackwardsTransitionEvent[] {
  const backwardsTransitionEvents: BackwardsTransitionEvent[] = [];

  for (const issue of issues) {
    if (!issue.changelog?.histories) {
      continue;
    }

    const transitionEvents = findBackwardsTransitions(issue);
    backwardsTransitionEvents.push(...transitionEvents);
  }

  return backwardsTransitionEvents.sort((a, b) => 
    new Date(a.transitionDate).getTime() - new Date(b.transitionDate).getTime()
  );
}

function findBackwardsTransitions(issue: JiraIssue): BackwardsTransitionEvent[] {
  const transitions: BackwardsTransitionEvent[] = [];
  
  for (const history of issue.changelog!.histories) {
    for (const item of history.items) {      
      if (item.field === 'status' && 
        item.fromString === TARGET_FROM_STATUS && 
        TARGET_TO_STATUSES.includes(item.toString)) {          
        transitions.push({
          ticketKey: issue.key,
          ticketSummary: issue.fields.summary,
          projectKey: issue.fields.project.key,
          transitionDate: history.created,
          fromStatus: item.fromString,
          toStatus: item.toString
        });
      }
    }
  }
  
  return transitions;
}

export function groupTransitionsByMonth(events: BackwardsTransitionEvent[]): MonthlyBackwardsReport[] {
  const monthlyGroups = new Map<string, BackwardsTransitionEvent[]>();

  for (const event of events) {
    const monthKey = new Date(event.transitionDate).toISOString().substring(0, 7); // YYYY-MM format
    
    if (!monthlyGroups.has(monthKey)) {
      monthlyGroups.set(monthKey, []);
    }
    
    monthlyGroups.get(monthKey)!.push(event);
  }

  const monthlyReports: MonthlyBackwardsReport[] = [];
  
  for (const [month, monthEvents] of monthlyGroups.entries()) {
    monthlyReports.push({
      month,
      events: monthEvents,
      totalCount: monthEvents.length
    });
  }

  return monthlyReports.sort((a, b) => a.month.localeCompare(b.month));
}