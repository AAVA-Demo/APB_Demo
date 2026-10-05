import { apiClient } from "./apiClient";
import type { Recommendation } from "../types/recommendations";

const baseUrl = "/api";

export const recommendationsApi = {
    getRecommendations: (issueId: string): Promise<Recommendation[]> => {
        return apiClient.get<Recommendation[]>(`${baseUrl}/issues/${issueId}/recommendations`);
    },
};
