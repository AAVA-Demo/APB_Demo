export interface DiagnosticInsightDto {
    id: string;
    rootCause: string;
    confidence: number;
}

export interface DiagnosticInsightResponseDto {
    interactionId: string;
    insights: DiagnosticInsightDto[];
}
