export interface DiagnosticInsightsResponse {
    caseId: string;
    insights: string[];
    generatedAt: string;
}

export type ChangeType = "CASE_UPDATE" | "MEMBER_CONTEXT_UPDATE";

export interface InsightsUpdateNotificationRequest {
    changeType: ChangeType;
    changedFields: string[];
}

export interface InsightsUpdateNotificationResponse {
    caseId: string;
    status: string;
}

export interface DiagnosticInsightEvent {
    caseId: string;
    insights: string[];
    generatedAt: string;
}
