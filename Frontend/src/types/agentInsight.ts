export interface AgentDiagnosticInsightDto {
    id: string;
    title: string;
    description: string;
}

export interface AgentRemediationStepDto {
    stepNumber: number;
    instruction: string;
}

export interface AgentInsightResponseDto {
    interactionId: string;
    issueContext: string;
    diagnosticInsights: AgentDiagnosticInsightDto[];
    remediationSteps: AgentRemediationStepDto[];
}
