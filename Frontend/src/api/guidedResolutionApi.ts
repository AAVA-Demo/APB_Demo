import { apiClient } from "./apiClient";
import type { GuidedResolutionWorkflow } from "../types/guidedResolution";

const baseUrl = "/api";

export interface GuidedResolutionStepStatusUpdateDto {
    stepId: string;
    newStatus: string;
}

export const guidedResolutionApi = {
    getWorkflow: (issueId: string): Promise<GuidedResolutionWorkflow> => {
        return apiClient.get<GuidedResolutionWorkflow>(`${baseUrl}/issues/${issueId}/guided-workflow`);
    },
    updateStepStatus: (
        issueId: string,
        update: GuidedResolutionStepStatusUpdateDto
    ): Promise<GuidedResolutionWorkflow> => {
        return apiClient.post<GuidedResolutionStepStatusUpdateDto, GuidedResolutionWorkflow>(
            `${baseUrl}/issues/${issueId}/guided-workflow/steps/status`,
            update
        );
    },
};
