import { apiClient } from "./apiClient";
import type { CaseSummary } from "../types/caseSummary";

const baseUrl = "/api";

export const caseSummaryApi = {
    getCaseSummary: (caseId: string): Promise<CaseSummary> => {
        return apiClient.get<CaseSummary>(`${baseUrl}/cases/${caseId}/summary`);
    },
};
