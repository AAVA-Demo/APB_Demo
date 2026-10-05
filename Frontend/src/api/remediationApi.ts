import { apiGet } from "./apiClient";
import { RemediationStepsResponseDto } from "../types/remediation";

export async function getRemediationSteps(caseId: string): Promise<RemediationStepsResponseDto> {
    return apiGet<RemediationStepsResponseDto>(`/api/remediation/${encodeURIComponent(caseId)}`);
}
