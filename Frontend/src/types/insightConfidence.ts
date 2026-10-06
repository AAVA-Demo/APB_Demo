export interface RemediationStepDto {
    stepId: string;
    order: number;
    text: string;
}

export interface InsightWithConfidenceDto {
    insightId: string;
    title: string;
    description: string;
    confidenceScore: number;
    confidenceLevel: string;
    confidenceLabel: string;
    remediationSteps: RemediationStepDto[];
}

export interface InsightsWithConfidenceResponseDto {
    caseId: string;
    memberId: string;
    insights: InsightWithConfidenceDto[];
}

export interface InsightConfidenceDetailsDto {
    insightId: string;
    confidenceScore: number;
    confidenceLevel: string;
    confidenceLabel: string;
    explanation: string;
}

export interface InsightWithConfidenceViewModel {
    insightId: string;
    title: string;
    description: string;
    confidenceScore: number;
    confidenceLevel: string;
    confidenceLabel: string;
    remediationSteps: RemediationStepDto[];
}

export interface InsightConfidenceDetailsViewModel {
    insightId: string;
    confidenceScore: number;
    confidenceLevel: string;
    confidenceLabel: string;
    explanation: string;
}
