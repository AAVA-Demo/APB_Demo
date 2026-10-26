export interface RemediationStepDto {
    stepOrder: number;
    description: string;
}

export interface RemediationStepsDto {
    caseId: string;
    insightId: string;
    steps: RemediationStepDto[];
}
