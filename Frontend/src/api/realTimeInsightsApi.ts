import { getApiClient } from "./apiClient";
import { RealTimeInsightDto } from "../types/realtimeInsight";

export async function getLatestInsights(caseId: string): Promise<RealTimeInsightDto> {
    const client = getApiClient();
    const response = await client.get(`/api/cases/${caseId}/diagnostics/latest`);
    return response.data.data as RealTimeInsightDto;
}
