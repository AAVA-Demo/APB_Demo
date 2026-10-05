import { apiClient } from './apiClient';
import { RemediationStep } from '../types/RemediationStep';

export async function getRemediationSteps(insightId: string): Promise<RemediationStep[]> {
    return apiClient.get<RemediationStep[]>(`/api/insights/${insightId}/remediation`);
}
