export interface CaseResolutionMetricsRequest {
    handleTimeSeconds: number;
    stepsFollowed: number;
    aiGuidanceUsed: boolean;
}

export interface CaseResolutionMetricsResponse {
    caseId: string;
    handleTimeSeconds: number;
    stepsFollowed: number;
    aiGuidanceUsed: boolean;
    recordedAt: string;
}
