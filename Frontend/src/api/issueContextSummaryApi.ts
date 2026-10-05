import { apiGet } from "./apiClient";
import { IssueContextSummaryResponse } from "../types/issueContextSummary";

export async function getIssueContextSummary(caseId: string, token?: string): Promise<IssueContextSummaryResponse> {
    const url = `/api/cases/${encodeURIComponent(caseId)}/issue-context-summary`;
    return apiGet<IssueContextSummaryResponse>(url, token);
}
