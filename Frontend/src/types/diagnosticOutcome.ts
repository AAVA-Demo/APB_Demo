export interface RecordResolutionOutcomeRequest {
    isResolved: boolean;
    comment: string;
    recordedBy: string;
}

export interface DiagnosticOutcomeDto {
    caseId: string;
    insightId: string;
    isResolved: boolean;
    comment: string;
    recordedBy: string;
    recordedAt: string;
}
