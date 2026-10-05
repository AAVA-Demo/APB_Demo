import { apiGet } from "./apiClient";
import { IssueContextSummaryDto } from "../types/issueContext";

export async function getIssueContextSummary(caseId: string): Promise<IssueContextSummaryDto> {
    return apiGet<IssueContextSummaryDto>(`/api/issue-context/${encodeURIComponent(caseId)}`);
}
