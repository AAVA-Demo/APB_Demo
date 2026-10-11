import { getApiClient } from "./apiClient";
import { CaseInsightsDto } from "../types/insights";

export async function getInsightsWithConfidence(caseId: string): Promise<CaseInsightsDto> {
  const client = getApiClient();
  const response = await client.get<CaseInsightsDto>(`/cases/${caseId}/insights`);
  return response.data;
}
