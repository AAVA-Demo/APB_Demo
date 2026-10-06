import { getApiClient } from "./apiClient";
import { RemediationStepStatusListDto, RemediationStepStatusDto } from "../types/remediationStepTracking";

export async function getRemediationStepStatus(caseId: string, issueId: string): Promise<RemediationStepStatusListDto> {
    const client = getApiClient();
    const response = await client.get(`/api/cases/${caseId}/issues/${issueId}/remediation/steps/status`);
    return response.data.data as RemediationStepStatusListDto;
}

export async function markRemediationStepCompleted(caseId: string, issueId: string, stepId: string, completedBy: string): Promise<RemediationStepStatusDto> {
    const client = getApiClient();
    const response = await client.post(`/api/cases/${caseId}/issues/${issueId}/remediation/steps/${stepId}/complete`, {
        completedBy,
    });
    return response.data.data as RemediationStepStatusDto;
}
