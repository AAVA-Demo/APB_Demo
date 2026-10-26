import { apiGet } from "./apiClient";
import { RecommendationExplanationDto } from "../types/recommendationExplanation";

export const getRecommendationExplanation = (
    caseId: string,
    insightId: string,
    recommendationId: string
): Promise<RecommendationExplanationDto> => {
    const url = `/api/diagnostics/cases/${encodeURIComponent(caseId)}/insights/${encodeURIComponent(
        insightId
    )}/recommendations/${encodeURIComponent(recommendationId)}`;
    return apiGet<RecommendationExplanationDto>(url);
};
