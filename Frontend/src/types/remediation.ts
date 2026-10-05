export interface RemediationStepDto {
    stepNumber: number;
    instruction: string;
}

export interface RemediationStepsResponseDto {
    caseId: string;
    steps: RemediationStepDto[];
}
