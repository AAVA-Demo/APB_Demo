import apiClient from './apiClient';
import { Recommendation, RecommendationContextRequest } from '../types/recommendations';

export const recommendationsApi = {
  async getRecommendations(caseId: string, request: RecommendationContextRequest): Promise<Recommendation[]> {
    return apiClient<Recommendation[]>(`/api/cases/${caseId}/recommendations`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};
