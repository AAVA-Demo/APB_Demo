import { getApiClient } from "./apiClient";
import { RecommendationSetDto } from "../types/recommendation";

export async function getContextAwareRecommendations(caseId: string): Promise<RecommendationSetDto> {
    const client = getApiClient();
    const response = await client.get(`/api/cases/${caseId}/recommendations/context-aware`);
    return response.data.data as RecommendationSetDto;
}
