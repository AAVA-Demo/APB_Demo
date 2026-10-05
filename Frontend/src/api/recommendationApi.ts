import { apiGet } from "./apiClient";
import { RankedRecommendationResponseDto } from "../types/recommendation";

export async function getRankedRecommendations(interactionId: string): Promise<RankedRecommendationResponseDto> {
    return apiGet<RankedRecommendationResponseDto>(`/api/recommendations/${encodeURIComponent(interactionId)}`);
}
