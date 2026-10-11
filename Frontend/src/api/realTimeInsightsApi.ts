import { getApiClient } from "./apiClient";
import { CaseRealTimeInsightsDto } from "../types/realTimeInsights";

export async function getRealTimeInsights(caseId: string): Promise<CaseRealTimeInsightsDto> {
  const client = getApiClient();
  const response = await client.get<CaseRealTimeInsightsDto>(`/cases/${caseId}/real-time-insights`);
  return response.data;
}
