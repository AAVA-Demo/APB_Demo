import { apiGet } from "./apiClient";
import { RealTimeInsightsResponse } from "../types/realTimeInsights";

export async function getRealTimeInsights(caseId: string, token?: string): Promise<RealTimeInsightsResponse> {
    const url = `/api/cases/${encodeURIComponent(caseId)}/real-time-insights`;
    return apiGet<RealTimeInsightsResponse>(url, token);
}
