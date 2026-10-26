export interface InsightDto {
    insightId: string;
    title: string;
    priority: string;
    summary: string;
}

export interface InsightListDto {
    caseId: string;
    insights: InsightDto[];
}
