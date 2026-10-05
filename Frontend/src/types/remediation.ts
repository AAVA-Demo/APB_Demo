export interface RemediationStepDto {
    stepNumber: number;
    title: string;
    description: string;
}

export interface RemediationStepsResponse {
    caseId: string;
    issueId: string;
    steps: RemediationStepDto[];
}
