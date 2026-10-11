import { getApiClient } from "./apiClient";
import { CaseRemediationStepsDto } from "../types/remediationSteps";

export async function getRemediationSteps(caseId: string): Promise<CaseRemediationStepsDto> {
  const client = getApiClient();
  const response = await client.get<CaseRemediationStepsDto>(`/cases/${caseId}/remediation-steps`);
  return response.data;
}
