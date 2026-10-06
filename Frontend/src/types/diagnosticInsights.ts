export interface RemediationStepDto {
    stepId: string;
    order: number;
    text: string;
}

export interface InsightDto {
    insightId: string;
    title: string;
    description: string;
    confidence: number;
    status: string;
    lastUpdatedUtc: string;
    remediationSteps: RemediationStepDto[];
}

export interface DiagnosticInsightsResponseDto {
    caseId: string;
    memberId: string;
    insights: InsightDto[];
}

export interface InsightsRefreshStatusDto {
    caseId: string;
    refreshStatus: string;
    refreshedAtUtc: string;
    refreshInProgress: boolean;
}

export interface RemediationStepViewModel {
    stepId: string;
    order: number;
    text: string;
}

export interface InsightViewModel {
    insightId: string;
    title: string;
    description: string;
    confidence: number;
    status: string;
    lastUpdatedUtc: string;
    remediationSteps: RemediationStepViewModel[];
}
