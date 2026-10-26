import { apiGet } from "./apiClient";
import { DiagnosticInsightListDto } from "../types/diagnosticInsights";

export const getDiagnosticInsights = (caseId: string): Promise<DiagnosticInsightListDto> => {
    const url = `/api/diagnostics/cases/${encodeURIComponent(caseId)}/insights/diagnostic`;
    return apiGet<DiagnosticInsightListDto>(url);
};
