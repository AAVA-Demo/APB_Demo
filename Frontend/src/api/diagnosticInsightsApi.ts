import { apiClient } from "./apiClient";
import type { DiagnosticInsight } from "../types/diagnosticInsights";

const baseUrl = "/api";

export const diagnosticInsightsApi = {
    getDiagnosticInsights: (caseId: string): Promise<DiagnosticInsight[]> => {
        return apiClient.get<DiagnosticInsight[]>(`${baseUrl}/cases/${caseId}/diagnostic-insights`);
    },
};
