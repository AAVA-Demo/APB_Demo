import { apiGet } from "./apiClient";
import { RemediationStepsResponse } from "../types/remediation";

export async function getRemediationSteps(caseId: string, issueId: string, token?: string): Promise<RemediationStepsResponse> {
    const url = `/api/cases/${encodeURIComponent(caseId)}/issues/${encodeURIComponent(issueId)}/remediation`;
    return apiGet<RemediationStepsResponse>(url, token);
}
