import { apiGet } from "./apiClient";
import { InsightsWithConfidenceResponseDto, InsightConfidenceDetailsDto } from "../types/insightConfidence";

export function getInsightsWithConfidenceForCase(caseId: string): Promise<InsightsWithConfidenceResponseDto> {
    return apiGet<InsightsWithConfidenceResponseDto>(`/diagnostics/cases/${caseId}/insights-with-confidence`);
}

export function getInsightConfidenceDetails(insightId: string): Promise<InsightConfidenceDetailsDto> {
    return apiGet<InsightConfidenceDetailsDto>(`/diagnostics/insights/${insightId}/confidence`);
}
