import { apiClient } from "./apiClient";
import type { RemediationStep } from "../types/remediationSteps";

const baseUrl = "/api";

export const remediationStepsApi = {
    getRemediationSteps: (issueId: string): Promise<RemediationStep[]> => {
        return apiClient.get<RemediationStep[]>(`${baseUrl}/issues/${issueId}/remediation-steps`);
    },
};
