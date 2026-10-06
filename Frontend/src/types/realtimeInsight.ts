export interface RealTimeInsightItemDto {
    code: string;
    title: string;
    description: string;
    severity: string;
    lastUpdatedUtc: string;
}

export interface RealTimeInsightDto {
    caseId: string;
    insights: RealTimeInsightItemDto[];
}
