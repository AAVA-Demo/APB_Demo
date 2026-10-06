import { apiClient } from './apiClient';
import { ContextRecommendationsDto } from '../types/contextRecommendations';

export async function getContextAwareRecommendations(memberIssueId: string): Promise<ContextRecommendationsDto> {
    const url = `/api/diagnostic-panel/context-recommendations?memberIssueId=${encodeURIComponent(memberIssueId)}`;
    return apiClient(url);
}
