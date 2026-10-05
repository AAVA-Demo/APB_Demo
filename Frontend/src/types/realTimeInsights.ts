export interface RealTimeInsightDto {
    id: string;
    summary: string;
    details: string;
    generatedAt: string;
}

export interface RealTimeInsightsResponse {
    caseId: string;
    insights: RealTimeInsightDto[];
}
