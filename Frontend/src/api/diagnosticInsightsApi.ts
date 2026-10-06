import { apiClient } from './apiClient';
import { DiagnosticInsightsDto } from '../types/diagnosticInsights';

export async function getRealTimeDiagnosticInsights(memberIssueId: string): Promise<DiagnosticInsightsDto> {
    const url = `/api/diagnostic-panel/diagnostic-insights?memberIssueId=${encodeURIComponent(memberIssueId)}`;
    return apiClient(url);
}
