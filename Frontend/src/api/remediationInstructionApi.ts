import { apiGet } from "./apiClient";
import { RemediationInstructionResponse } from "../types/remediation";

export function getRemediationInstructions(caseId: string): Promise<RemediationInstructionResponse> {
    return apiGet<RemediationInstructionResponse>(`/api/support/cases/${caseId}/remediation`);
}
