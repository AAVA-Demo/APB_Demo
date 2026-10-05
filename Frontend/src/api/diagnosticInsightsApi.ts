import { apiGet, apiPost } from "./apiClient";
import { DiagnosticInsightsResponse, DiagnosticInsightEvent, InsightsUpdateNotificationRequest, InsightsUpdateNotificationResponse } from "../types/diagnosticInsights";

export function getDiagnosticInsights(caseId: string): Promise<DiagnosticInsightsResponse> {
    return apiGet<DiagnosticInsightsResponse>(`/api/support/cases/${caseId}/insights`);
}

export function notifyInsightsUpdate(caseId: string, request: InsightsUpdateNotificationRequest): Promise<InsightsUpdateNotificationResponse> {
    return apiPost<InsightsUpdateNotificationRequest, InsightsUpdateNotificationResponse>(
        `/api/support/cases/${caseId}/insights/notify`,
        request
    );
}

export function createInsightsEventSource(caseId: string): EventSource {
    return new EventSource(`/api/support/cases/${caseId}/insights/stream`);
}
