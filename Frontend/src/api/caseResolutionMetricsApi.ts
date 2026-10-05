import { apiGet, apiPost } from "./apiClient";
import { CaseResolutionMetricsRequest, CaseResolutionMetricsResponse } from "../types/caseResolutionMetrics";

export function recordCaseResolutionMetrics(caseId: string, request: CaseResolutionMetricsRequest): Promise<CaseResolutionMetricsResponse> {
    return apiPost<CaseResolutionMetricsRequest, CaseResolutionMetricsResponse>(
        `/api/support/cases/${caseId}/metrics`,
        request
    );
}

export function getCaseResolutionMetrics(caseId: string): Promise<CaseResolutionMetricsResponse> {
    return apiGet<CaseResolutionMetricsResponse>(`/api/support/cases/${caseId}/metrics`);
}
