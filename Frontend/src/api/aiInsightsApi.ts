import { apiClient } from "./apiClient";
import { AiInsightsResponseDto } from "../types/aiInsights";

export function getAiInsightsWithConfidence(interactionId: string): Promise<AiInsightsResponseDto> {
  return apiClient<AiInsightsResponseDto>(`/api/interactions/${interactionId}/ai-insights`);
}
