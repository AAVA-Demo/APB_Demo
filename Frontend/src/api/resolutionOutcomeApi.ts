import apiClient from './apiClient';
import { ResolutionOutcome, CreateResolutionOutcomeRequest } from '../types/resolutionOutcome';

export const resolutionOutcomeApi = {
  async createOutcome(issueId: string, request: CreateResolutionOutcomeRequest): Promise<ResolutionOutcome> {
    return apiClient<ResolutionOutcome>(`/api/issues/${issueId}/resolution-outcome`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getOutcome(issueId: string): Promise<ResolutionOutcome> {
    return apiClient<ResolutionOutcome>(`/api/issues/${issueId}/resolution-outcome`, {
      method: 'GET',
    });
  },

  async updateOutcome(issueId: string, request: CreateResolutionOutcomeRequest): Promise<ResolutionOutcome> {
    return apiClient<ResolutionOutcome>(`/api/issues/${issueId}/resolution-outcome`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },
};
