export interface DiagnosticItemDto {
    code: string;
    title: string;
    description: string;
    severity: string;
    lastUpdatedUtc: string;
}

export interface DiagnosticInsightDto {
    caseId: string;
    insights: DiagnosticItemDto[];
    generatedBy: string;
    generatedAtUtc: string;
}
