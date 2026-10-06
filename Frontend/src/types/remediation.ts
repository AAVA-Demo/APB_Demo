export interface RemediationStepDto {
    stepOrder: number;
    title: string;
    description: string;
    estimatedDurationMinutes?: number;
}

export interface RemediationGuidanceDto {
    caseId: string;
    issueId: string;
    steps: RemediationStepDto[];
}
