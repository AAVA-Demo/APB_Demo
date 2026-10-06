import { apiClient } from './apiClient';
import { RemediationGuidanceDto } from '../types/remediationGuidance';

export async function getRemediationGuidance(memberIssueId: string): Promise<RemediationGuidanceDto> {
    const url = `/api/diagnostic-panel/remediation-guidance?memberIssueId=${encodeURIComponent(memberIssueId)}`;
    return apiClient(url);
}
