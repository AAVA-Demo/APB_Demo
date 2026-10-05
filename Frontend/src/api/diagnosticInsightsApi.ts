import { apiGet } from "./apiClient";
import { DiagnosticInsightsResponse } from "../types/diagnosticInsights";

export function getCurrentDiagnosticInsights(memberId: string) {
  return apiGet<DiagnosticInsightsResponse>(
    `api/diagnostics/members/${encodeURIComponent(memberId)}/current-insights`
  );
}
