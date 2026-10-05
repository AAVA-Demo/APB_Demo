import { apiGet } from "./apiClient";
import { DiagnosticInsightResponseDto } from "../types/diagnosticInsight";

export async function getDiagnosticInsights(interactionId: string): Promise<DiagnosticInsightResponseDto> {
    return apiGet<DiagnosticInsightResponseDto>(`/api/diagnostic-insights/${encodeURIComponent(interactionId)}`);
}
