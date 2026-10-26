import { apiGet } from "./apiClient";
import { InsightListDto } from "../types/insights";
import { CurrentInsightsDto } from "../types/realTimeInsights";

export const getPrioritizedInsights = (caseId: string): Promise<InsightListDto> => {
    const url = `/api/diagnostics/cases/${encodeURIComponent(caseId)}/insights`;
    return apiGet<InsightListDto>(url);
};

export const getCurrentInsights = (caseId: string): Promise<CurrentInsightsDto> => {
    const url = `/api/diagnostics/cases/${encodeURIComponent(caseId)}/insights/current`;
    return apiGet<CurrentInsightsDto>(url);
};
