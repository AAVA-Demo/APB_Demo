import { apiGet } from "./apiClient";
import { RemediationStepsDto } from "../types/remediationSteps";

export const getRemediationSteps = (
    caseId: string,
    insightId: string
): Promise<RemediationStepsDto> => {
    const url = `/api/diagnostics/cases/${encodeURIComponent(caseId)}/insights/${encodeURIComponent(
        insightId
    )}/remediation-steps`;
    return apiGet<RemediationStepsDto>(url);
};
