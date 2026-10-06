import { apiGet, apiPost, createEventSource } from "./apiClient";
import { DiagnosticInsightsResponseDto, InsightsRefreshStatusDto } from "../types/diagnosticInsights";

export function getDiagnosticInsightsForCase(caseId: string): Promise<DiagnosticInsightsResponseDto> {
    return apiGet<DiagnosticInsightsResponseDto>(`/diagnostics/cases/${caseId}/insights`);
}

export function subscribeInsightsRefreshStreamForCase(caseId: string): EventSource {
    return createEventSource(`/diagnostics/cases/${caseId}/insights/stream`);
}

export function triggerManualInsightsRefreshForCase(caseId: string): Promise<InsightsRefreshStatusDto> {
    return apiPost<InsightsRefreshStatusDto>(`/diagnostics/cases/${caseId}/insights/refresh`, { caseId });
}

export function getInsightsRefreshStatusForCase(caseId: string): Promise<InsightsRefreshStatusDto> {
    return apiGet<InsightsRefreshStatusDto>(`/diagnostics/cases/${caseId}/insights/refreshStatus`);
}
