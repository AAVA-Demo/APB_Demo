import { apiClient } from "./apiClient";
import { DiagnosticInsight } from "../types/diagnostic";

export const diagnosticsClient = {
    getDiagnosticInsights(memberId: string): Promise<DiagnosticInsight[]> {
        return apiClient.get<DiagnosticInsight[]>(`/api/members/${memberId}/diagnostic-insights`);
    },
};
