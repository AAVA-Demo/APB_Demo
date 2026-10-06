import { getApiClient } from "./apiClient";
import { DiagnosticInsightDto } from "../types/diagnostic";

export async function getRealTimeDiagnostics(caseId: string): Promise<DiagnosticInsightDto> {
    const client = getApiClient();
    const response = await client.get(`/api/cases/${caseId}/diagnostics/real-time`);
    return response.data.data as DiagnosticInsightDto;
}
