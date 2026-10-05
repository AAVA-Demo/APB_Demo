import { apiGet } from "./apiClient";
import { IssueSummaryResponse } from "../types/issueSummary";

export function getIssueSummary(memberId: string, issueId: string) {
  return apiGet<IssueSummaryResponse>(
    `api/diagnostics/members/${encodeURIComponent(
      memberId
    )}/issues/${encodeURIComponent(issueId)}/summary`
  );
}
