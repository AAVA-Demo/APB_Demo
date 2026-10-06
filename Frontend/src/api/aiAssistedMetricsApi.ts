import { apiClient } from './apiClient';
import { AiAssistedResolutionMetricsDto } from '../types/aiAssistedMetrics';

export async function getAiAssistedResolutionMetrics(fromDate: string, toDate: string): Promise<AiAssistedResolutionMetricsDto> {
    const url = `/api/diagnostic-panel/metrics/ai-assisted?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}`;
    return apiClient(url);
}
