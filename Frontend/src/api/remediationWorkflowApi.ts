import { apiGet, apiPost, apiPatch } from "./apiClient";
import { RemediationWorkflowResponseDto, RemediationWorkflowStartResponseDto, RemediationStepStatusDto, RemediationWorkflowStatusDto } from "../types/remediationWorkflow";

export function getRemediationWorkflowForCase(caseId: string): Promise<RemediationWorkflowResponseDto> {
    return apiGet<RemediationWorkflowResponseDto>(`/remediation/cases/${caseId}/workflow`);
}

export function startRemediationWorkflowForIssue(caseId: string, issueId: string): Promise<RemediationWorkflowStartResponseDto> {
    return apiPost<RemediationWorkflowStartResponseDto>(`/remediation/cases/${caseId}/issues/${issueId}/start`, { caseId, issueId });
}

export function updateRemediationStepStatus(caseId: string, stepInstanceId: string, status: string): Promise<RemediationStepStatusDto> {
    return apiPatch<RemediationStepStatusDto>(`/remediation/cases/${caseId}/workflow/steps/${stepInstanceId}`, { status });
}

export function getRemediationWorkflowStatusForCase(caseId: string): Promise<RemediationWorkflowStatusDto> {
    return apiGet<RemediationWorkflowStatusDto>(`/remediation/cases/${caseId}/workflow/status`);
}
