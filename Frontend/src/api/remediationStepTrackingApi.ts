import { apiGet, apiPost } from "./apiClient";
import {
  RemediationStepListResponse,
  RemediationStepUpdateResponse,
  RemediationStepCompleteRequest,
} from "../types/remediationStepTracking";

export function getTrackedRemediationSteps(issueId: string) {
  return apiGet<RemediationStepListResponse>(
    `api/diagnostics/issues/${encodeURIComponent(issueId)}/remediation-steps`
  );
}

export function completeRemediationStep(
  issueId: string,
  stepId: string,
  request: RemediationStepCompleteRequest
) {
  return apiPost<RemediationStepUpdateResponse>(
    `api/diagnostics/issues/${encodeURIComponent(
      issueId
    )}/remediation-steps/${encodeURIComponent(stepId)}/complete`,
    request
  );
}
