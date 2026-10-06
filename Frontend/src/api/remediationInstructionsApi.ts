import { apiGet, apiPost } from "./apiClient";
import { RemediationInstructionsResponseDto, RemediationInstructionsRefreshStatusDto } from "../types/remediationInstructions";

export function getRemediationInstructions(issueId: string): Promise<RemediationInstructionsResponseDto> {
    return apiGet<RemediationInstructionsResponseDto>(`/remediation/issues/${issueId}/instructions`);
}

export function refreshRemediationInstructions(issueId: string): Promise<RemediationInstructionsRefreshStatusDto> {
    return apiPost<RemediationInstructionsRefreshStatusDto>(`/remediation/issues/${issueId}/instructions/refresh`, { issueId });
}
