import { apiGet } from "./apiClient";
import { RootCauseRecommendationResponse } from "../types/rootCause";

export function getRootCauseRecommendations(caseId: string): Promise<RootCauseRecommendationResponse> {
    return apiGet<RootCauseRecommendationResponse>(
        `/api/support/cases/${caseId}/root-cause-recommendations`
    );
}
