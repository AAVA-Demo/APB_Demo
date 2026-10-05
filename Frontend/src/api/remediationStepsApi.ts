import apiClient from './apiClient';
import { RemediationStep } from '../types/remediation';

export const remediationStepsApi = {
  async getSteps(issueId: string): Promise<RemediationStep[]> {
    return apiClient<RemediationStep[]>(`/api/issues/${issueId}/remediation-steps`, {
      method: 'GET',
    });
  },
};
