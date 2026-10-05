export interface MemberHistoryEvent {
    eventId: string;
    summary: string;
}

export interface ContextAwareInsightsResponse {
    memberId: string;
    caseId: string;
    insights: string[];
    referencedHistory: MemberHistoryEvent[];
    generatedAt: string;
}
