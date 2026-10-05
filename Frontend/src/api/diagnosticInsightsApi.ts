import apiClient from './apiClient';
import { DiagnosticInsights } from '../types/diagnosticInsights';

export const diagnosticInsightsApi = {
  async getInsights(caseId: string): Promise<DiagnosticInsights> {
    return apiClient<DiagnosticInsights>(`/api/cases/${caseId}/diagnostic-insights`, {
      method: 'GET',
    });
  },
};
