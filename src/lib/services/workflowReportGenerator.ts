import { BackwardsTransitionEvent, MonthlyBackwardsReport, groupTransitionsByMonth } from './backwardsWorkflowAnalyzer';

export function generateBackwardsWorkflowReport(projects: string[], events: BackwardsTransitionEvent[]): string {
  if (events.length === 0) {
    return 'No backwards workflow transitions found from "In DA Review" to target statuses.';
  }

  const monthlyReports = groupTransitionsByMonth(events);
  const totalEvents = events.length;
  const affectedTicketsCount = new Set(events.map(e => e.ticketKey)).size;

  let report = `# Backwards Workflow Analysis Report\n\n`;
  report += `**Analysis Period:** 2025\n`;
  report += `**Projects Analyzed:** ${projects.join(', ')}\n`;
  report += `**Target Transition:** From "In DA Review" to ["Ready for Adoption", "Ad Code Development In Progress", "Code Review"]\n\n`;
  
  report += `## Summary\n`;
  report += `- **Total Backwards Transitions:** ${totalEvents}\n`;
  report += `- **Unique Tickets Affected:** ${affectedTicketsCount}\n`;
  report += `- **Average Backwards Transitions per Affected Ticket:** ${(totalEvents / affectedTicketsCount).toFixed(2)}\n\n`;

  report += `## Monthly Breakdown\n\n`;

  for (const monthlyReport of monthlyReports) {
    const monthName = formatMonthName(monthlyReport.month);
    report += `### ${monthName} (${monthlyReport.totalCount} transitions)\n\n`;

    const projectCounts = getProjectBreakdown(monthlyReport.events);
    report += `**Project Breakdown:**\n`;
    for (const [project, count] of Object.entries(projectCounts)) {
      report += `- ${project}: ${count} transitions\n`;
    }
    report += `\n`;

    report += `| Ticket | Summary | Project | From Status | To Status | Transition Date |\n`;
    report += `|--------|---------|---------|-------------|-----------|----------------|\n`;

    for (const event of monthlyReport.events) {
      const formattedDate = new Date(event.transitionDate).toLocaleDateString();
      const truncatedSummary = event.ticketSummary.length > 50 
        ? event.ticketSummary.substring(0, 47) + '...' 
        : event.ticketSummary;
      
      report += `| ${event.ticketKey} | ${truncatedSummary} | ${event.projectKey} | ${event.fromStatus} | ${event.toStatus} | ${formattedDate} |\n`;
    }
    
    report += `\n`;
  }

  report += `## Project Summary\n\n`;
  const allProjectCounts = getProjectBreakdown(events);
  report += `| Project | Total Backwards Transitions | Unique Tickets Affected |\n`;
  report += `|---------|----------------------------|------------------------|\n`;

  for (const [project, count] of Object.entries(allProjectCounts).sort(([,a], [,b]) => b - a)) {
    const uniqueTickets = new Set(events.filter(e => e.projectKey === project).map(e => e.ticketKey)).size;
    report += `| ${project} | ${count} | ${uniqueTickets} |\n`;
  }

  return report;
}

function formatMonthName(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

function getProjectBreakdown(events: BackwardsTransitionEvent[]): Record<string, number> {
  const projectCounts: Record<string, number> = {};
  
  for (const event of events) {
    projectCounts[event.projectKey] = (projectCounts[event.projectKey] || 0) + 1;
  }
  
  return projectCounts;
}