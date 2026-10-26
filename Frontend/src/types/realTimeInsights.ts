export interface RealTimeInsightDto {
    insightId: string;
    title: string;
    summary: string;
    priority: string;
}

export interface CurrentInsightsDto {
    caseId: string;
    lastUpdatedAt: string;
    insights: RealTimeInsightDto[];
}
