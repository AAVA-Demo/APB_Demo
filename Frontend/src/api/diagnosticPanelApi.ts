import { apiGet } from "./apiClient";
import { DiagnosticPanelResponse } from "../types/diagnosticPanel";

export async function getDiagnosticPanel(caseId: string, memberId?: string, token?: string): Promise<DiagnosticPanelResponse> {
    const params = memberId ? `?memberId=${encodeURIComponent(memberId)}` : "";
    const url = `/api/cases/${encodeURIComponent(caseId)}/diagnostic-panel${params}`;
    return apiGet<DiagnosticPanelResponse>(url, token);
}
