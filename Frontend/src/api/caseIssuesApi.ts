import { getApiClient } from "./apiClient";
import { CaseIssueListDto } from "../types/issueSeverity";

export async function getCaseIssuesWithSeverity(caseId: string): Promise<CaseIssueListDto> {
    const client = getApiClient();
    const response = await client.get(`/api/cases/${caseId}/issues/severity`);
    return response.data.data as CaseIssueListDto;
}
