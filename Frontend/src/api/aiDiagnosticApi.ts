import { apiClient } from "./apiClient";
import { RealTimeDiagnosticInsightsResponseDto } from "../types/diagnosticInsights";

export function getRealTimeDiagnosticInsights(interactionId: string): Promise<RealTimeDiagnosticInsightsResponseDto> {
  return apiClient<RealTimeDiagnosticInsightsResponseDto>(`/api/interactions/${interactionId}/diagnostic-insights`);
}
