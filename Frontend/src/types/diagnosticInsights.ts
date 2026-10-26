export interface DiagnosticInsightDto {
    insightId: string;
    title: string;
    summary: string;
}

export interface DiagnosticInsightListDto {
    caseId: string;
    insights: DiagnosticInsightDto[];
}
