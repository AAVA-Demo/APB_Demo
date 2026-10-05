import { apiClient } from "./apiClient";
import { MemberIssueSummary } from "../types/memberIssueSummary";

export const memberSummaryClient = {
    getIssueSummary(memberId: string): Promise<MemberIssueSummary> {
        return apiClient.get<MemberIssueSummary>(`/api/members/${memberId}/issue-summary`);
    },
};
