import { getApiClient } from "./apiClient";
import { CaseResolutionsDto } from "../types/resolutions";

export async function getPrioritizedResolutions(caseId: string): Promise<CaseResolutionsDto> {
  const client = getApiClient();
  const response = await client.get<CaseResolutionsDto>(`/cases/${caseId}/resolutions`);
  return response.data;
}
