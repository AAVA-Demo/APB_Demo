import { apiClient } from "./apiClient";
import { ContextAwareRecommendationsResponseDto } from "../types/recommendations";

export function getContextAwareRecommendations(interactionId: string): Promise<ContextAwareRecommendationsResponseDto> {
  return apiClient<ContextAwareRecommendationsResponseDto>(`/api/interactions/${interactionId}/recommendations`);
}
