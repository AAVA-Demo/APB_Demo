export interface Insight {
    id: string;
    issueId: string;
    title: string;
    summary: string;
    details: string;
    priority: number;
    createdAt: string;
    source: string;
    description: string;
    recommendation: string;
    confidenceScore: number;
    confidenceBand: string;
    updatedAt: string;
}
