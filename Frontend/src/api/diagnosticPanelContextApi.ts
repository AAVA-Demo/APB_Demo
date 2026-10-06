import { apiClient } from './apiClient';
import { DiagnosticPanelContextDto } from '../types/diagnosticPanelContext';

export async function getDiagnosticPanelContext(memberIssueId: string): Promise<DiagnosticPanelContextDto> {
    const url = `/api/diagnostic-panel/context?memberIssueId=${encodeURIComponent(memberIssueId)}`;
    return apiClient(url);
}
