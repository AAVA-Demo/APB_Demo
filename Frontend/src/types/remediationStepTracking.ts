export interface RemediationStepStatusDto {
    stepId: string;
    stepOrder: number;
    title: string;
    isCompleted: boolean;
    completedBy: string;
    completedAtUtc?: string;
}

export interface RemediationStepStatusListDto {
    caseId: string;
    issueId: string;
    steps: RemediationStepStatusDto[];
}
