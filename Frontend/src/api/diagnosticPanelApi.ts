import { getApiClient } from "./apiClient";
import { DiagnosticPanelContextDto } from "../types/diagnosticPanel";

export async function getDiagnosticPanelContext(workspaceId: string, caseId: string): Promise<DiagnosticPanelContextDto> {
  const client = getApiClient();
  const response = await client.get<DiagnosticPanelContextDto>(`/workspace/${workspaceId}/cases/${caseId}/diagnostic-panel`);
  return response.data;
}
