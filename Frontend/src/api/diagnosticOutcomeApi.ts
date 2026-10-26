import { apiPost } from "./apiClient";
import { DiagnosticOutcomeDto, RecordResolutionOutcomeRequest } from "../types/diagnosticOutcome";

export const recordResolutionOutcome = (
    caseId: string,
    insightId: string,
    request: RecordResolutionOutcomeRequest
): Promise<DiagnosticOutcomeDto> => {
    const url = `/api/diagnostics/cases/${encodeURIComponent(caseId)}/insights/${encodeURIComponent(
        insightId
    )}/outcome`;
    return apiPost<RecordResolutionOutcomeRequest, DiagnosticOutcomeDto>(url, request);
};
