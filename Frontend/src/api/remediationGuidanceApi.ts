import { getApiClient } from "./apiClient";
import { RemediationGuidanceDto } from "../types/remediation";

export async function getIssueRemediationSteps(caseId: string, issueId: string): Promise<RemediationGuidanceDto> {
    const client = getApiClient();
    const response = await client.get(`/api/cases/${caseId}/issues/${issueId}/remediation`);
    return response.data.data as RemediationGuidanceDto;
}
