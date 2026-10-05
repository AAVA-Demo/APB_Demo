export interface RemediationStep {
    stepNumber: number;
    title: string;
    description: string;
}

export interface RemediationInstructionResponse {
    caseId: string;
    steps: RemediationStep[];
    generatedAt: string;
}
