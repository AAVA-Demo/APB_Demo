import { apiClient } from "./apiClient";
import { Recommendation } from "../types/recommendation";

export const recommendationsClient = {
    getRecommendations(memberId: string): Promise<Recommendation[]> {
        return apiClient.get<Recommendation[]>(`/api/members/${memberId}/recommendations`);
    },
};
