import { apiClient } from './apiClient';
import { Insight } from '../types/Insight';
import { RealTimeConnection } from '../types/RealTimeConnection';
import { InsightRefreshRequest } from '../types/InsightRefreshRequest';

export async function getInsights(issueId: string): Promise<Insight[]> {
    return apiClient.get<Insight[]>(`/api/issues/${issueId}/insights`);
}

export async function getInsightStream(issueId: string): Promise<RealTimeConnection> {
    return apiClient.get<RealTimeConnection>(`/api/issues/${issueId}/insights/stream`);
}

export async function refreshInsights(request: InsightRefreshRequest): Promise<void> {
    await apiClient.post<void>(`/api/issues/${request.issueId}/insights/refresh`, {
        method: 'POST',
        body: JSON.stringify(request),
    } as any);
}
