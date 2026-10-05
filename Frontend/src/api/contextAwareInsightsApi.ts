import { apiGet } from "./apiClient";
import { ContextAwareInsightsResponse } from "../types/contextAwareInsights";

export function getContextAwareInsights(memberId: string, caseId: string): Promise<ContextAwareInsightsResponse> {
    const url = `/api/support/members/${memberId}/context-insights?caseId=${encodeURIComponent(caseId)}`;
    return apiGet<ContextAwareInsightsResponse>(url);
}
