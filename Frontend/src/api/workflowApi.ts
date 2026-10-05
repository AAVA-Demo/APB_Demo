import apiClient from './apiClient';
import { Workflow, CompleteStepRequest } from '../types/workflow';

export const workflowApi = {
  async getWorkflow(issueId: string): Promise<Workflow> {
    return apiClient<Workflow>(`/api/issues/${issueId}/workflow`, {
      method: 'GET',
    });
  },

  async completeStep(issueId: string, stepId: string, request: CompleteStepRequest): Promise<Workflow> {
    return apiClient<Workflow>(`/api/issues/${issueId}/workflow/steps/${stepId}/complete`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};
