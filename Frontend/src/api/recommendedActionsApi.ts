import { apiClient } from "./apiClient";
import type { RecommendedAction } from "../types/recommendedActions";

const baseUrl = "/api";

export const recommendedActionsApi = {
    getRecommendedActions: (issueId: string): Promise<RecommendedAction[]> => {
        return apiClient.get<RecommendedAction[]>(`${baseUrl}/issues/${issueId}/recommended-actions`);
    },
};
