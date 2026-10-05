import { apiClient } from './apiClient';
import { Workflow } from '../types/Workflow';
import { StepCompletionRequest } from '../types/StepCompletionRequest';

export async function getWorkflow(issueId: string): Promise<Workflow> {
    return apiClient.get<Workflow>(`/api/issues/${issueId}/workflow`);
}

export async function completeWorkflowStep(issueId: string, stepId: string, request: StepCompletionRequest): Promise<Workflow> {
    return apiClient.post<Workflow>(`/api/issues/${issueId}/workflow/steps/${stepId}`, {
        method: 'POST',
        body: JSON.stringify(request),
    } as any);
}
