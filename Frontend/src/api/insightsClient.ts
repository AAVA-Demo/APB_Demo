import { apiClient } from "./apiClient";
import { MemberInsight } from "../types/memberInsight";

export interface RefreshInsightsRequest {
    correlationId?: string;
}

export const insightsClient = {
    getInsights(memberId: string): Promise<MemberInsight[]> {
        return apiClient.get<MemberInsight[]>(`/api/members/${memberId}/insights`);
    },

    refreshInsights(memberId: string, request?: RefreshInsightsRequest): Promise<MemberInsight[]> {
        return apiClient.post<MemberInsight[]>(
            `/api/members/${memberId}/insights/refresh`,
            request
        );
    },
};
