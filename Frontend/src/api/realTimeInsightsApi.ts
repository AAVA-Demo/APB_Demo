import { apiGet, apiPost, createEventSource } from "./apiClient";
import { RealTimeInsightsResponseDto, RealTimeInsightsAnalysisResponseDto } from "../types/realTimeInsights";

export function getRealTimeInsights(caseId: string): Promise<RealTimeInsightsResponseDto> {
    return apiGet<RealTimeInsightsResponseDto>(`/real-time/cases/${caseId}/insights`);
}

export function analyzeCaseRealTime(caseId: string): Promise<RealTimeInsightsAnalysisResponseDto> {
    return apiPost<RealTimeInsightsAnalysisResponseDto>(`/real-time/cases/${caseId}/analyze`, { caseId });
}

export function subscribeRealTimeInsightsStream(caseId: string): EventSource {
    return createEventSource(`/real-time/cases/${caseId}/insights/stream`);
}
