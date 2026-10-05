import apiClient from './apiClient';
import { Issue } from '../types/issues';

export const issueApi = {
  async getActiveIssues(): Promise<Issue[]> {
    return apiClient<Issue[]>(`/api/issues/active`, {
      method: 'GET',
    });
  },

  async getIssue(issueId: string): Promise<Issue> {
    return apiClient<Issue>(`/api/issues/${issueId}`, {
      method: 'GET',
    });
  },
};
