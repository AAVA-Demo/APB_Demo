export interface MemberContext {
    memberId: string;
    caseId: string;
    issueDescription: string;
    recentActivity: Interaction[];
    relevantHistory: HistoryItem[];
}

export interface Interaction {
    id: string;
    channel: string;
    summary: string;
    occurredAt: string;
}

export interface HistoryItem {
    id: string;
    description: string;
    category: string;
    occurredAt: string;
}
