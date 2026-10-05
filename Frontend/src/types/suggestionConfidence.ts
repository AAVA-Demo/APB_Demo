export interface SuggestionConfidenceDto {
  suggestionId: string;
  description: string;
  confidenceScore: number;
  confidenceLevel: string;
}

export interface SuggestionConfidenceResponse {
  memberId: string;
  suggestions: SuggestionConfidenceDto[];
}

export interface SuggestionConfidenceViewModel {
  suggestionId: string;
  description: string;
  confidenceScore: number;
  confidenceLevel: string;
  labelText: string;
  colorClass: string;
}
