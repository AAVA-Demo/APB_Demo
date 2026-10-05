import { apiGet } from "./apiClient";
import { RemediationStepResponse } from "../types/remediationStep";

export function getRemediationSteps(memberId: string, issueId: string) {
  return apiGet<RemediationStepResponse>(
    `api/diagnostics/members/${encodeURIComponent(
      memberId
    )}/issues/${encodeURIComponent(issueId)}/steps`
  );
}
