import { getApiClient } from "./apiClient";
import { ContextAwareRecommendationsDto } from "../types/contextAwareRecommendations";

export async function getContextAwareRecommendations(caseId: string): Promise<ContextAwareRecommendationsDto> {
  const client = getApiClient();
  const response = await client.get<ContextAwareRecommendationsDto>(`/cases/${caseId}/context-aware-recommendations`);
  return response.data;
}
