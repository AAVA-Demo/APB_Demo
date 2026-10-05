import { apiClient } from "./apiClient";
import { RemediationStep, UpdateRemediationStepStatusRequest } from "../types/remediation";

export const remediationClient = {
    getRemediationSteps(memberId: string): Promise<RemediationStep[]> {
        return apiClient.get<RemediationStep[]>(`/api/members/${memberId}/remediation-steps`);
    },

    updateRemediationStep(
        memberId: string,
        stepId: string,
        request: UpdateRemediationStepStatusRequest
    ): Promise<RemediationStep> {
        return apiClient.patch<RemediationStep>(
            `/api/members/${memberId}/remediation-steps/${stepId}`,
            request
        );
    },
};
