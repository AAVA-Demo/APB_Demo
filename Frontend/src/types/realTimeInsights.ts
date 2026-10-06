export interface RealTimeInsightDto {
    insightId: string;
    title: string;
    description: string;
    severity: string;
    createdAtUtc: string;
}

export interface RealTimeInsightsResponseDto {
    caseId: string;
    insights: RealTimeInsightDto[];
}

export interface RealTimeInsightsAnalysisResponseDto extends RealTimeInsightsResponseDto {
    memberId: string;
}

export interface RealTimeInsightViewModel {
    insightId: string;
    title: string;
    description: string;
    severity: string;
    createdAt: string;
}
