import { apiPost } from "./apiClient";
import { RecommendationFeedbackRequest, RecommendationFeedbackResponse } from "../types/recommendationFeedback";

export async function submitRecommendationFeedback(
    recommendationId: string,
    request: RecommendationFeedbackRequest,
    token?: string
): Promise<RecommendationFeedbackResponse> {
    const url = `/api/recommendations/${encodeURIComponent(recommendationId)}/feedback`;
    return apiPost<RecommendationFeedbackRequest, RecommendationFeedbackResponse>(url, request, token);
}
