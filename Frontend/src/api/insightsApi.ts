import { apiGet } from "./apiClient";
import { InsightIndicator } from "../types/insights";

export async function getInsights(caseId: string, token?: string): Promise<InsightIndicator[]> {
    const url = `/api/cases/${encodeURIComponent(caseId)}/insights`;
    return apiGet<InsightIndicator[]>(url, token);
}
