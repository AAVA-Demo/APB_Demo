import { apiGet, apiPost } from "./apiClient";
import { ContextAwareIssueAnalysisResponseDto, ContextAwareIssuesResponseDto } from "../types/contextAwareIssues";

export function analyzeMemberCaseWithContext(caseId: string): Promise<ContextAwareIssueAnalysisResponseDto> {
    return apiPost<ContextAwareIssueAnalysisResponseDto>(`/context-aware/cases/${caseId}/analyze`, { caseId });
}

export function getContextAwareIssuesForCase(caseId: string): Promise<ContextAwareIssuesResponseDto> {
    return apiGet<ContextAwareIssuesResponseDto>(`/context-aware/cases/${caseId}/issues`);
}
