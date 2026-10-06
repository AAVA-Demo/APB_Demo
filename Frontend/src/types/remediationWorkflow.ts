export interface RemediationStepInstanceDto {
    stepInstanceId: string;
    definitionStepId: string;
    order: number;
    title: string;
    description: string;
    isRequired: boolean;
    status: string;
}

export interface RemediationWorkflowResponseDto {
    caseId: string;
    issueId: string;
    steps: RemediationStepInstanceDto[];
    overallStatus: string;
}

export interface RemediationWorkflowStartResponseDto {
    caseId: string;
    issueId: string;
    workflowId: string;
    overallStatus: string;
}

export interface RemediationStepStatusDto {
    stepInstanceId: string;
    status: string;
    updatedAtUtc: string;
}

export interface RemediationWorkflowStatusDto {
    caseId: string;
    workflowId: string;
    overallStatus: string;
    completedStepCount: number;
    totalStepCount: number;
}

export interface RemediationWorkflowStepViewModel {
    stepInstanceId: string;
    definitionStepId: string;
    order: number;
    title: string;
    description: string;
    isRequired: boolean;
    status: string;
}

export interface RemediationWorkflowViewModel {
    caseId: string;
    issueId: string;
    steps: RemediationWorkflowStepViewModel[];
    overallStatus: string;
}
