import { apiGet } from "./apiClient";
import { SuggestionConfidenceResponse } from "../types/suggestionConfidence";

export function getSuggestionsWithConfidence(memberId: string) {
  return apiGet<SuggestionConfidenceResponse>(
    `api/diagnostics/members/${encodeURIComponent(
      memberId
    )}/suggestions-confidence`
  );
}
