export interface ResolutionSuggestionDto {
  id: string;
  text: string;
  expectedResolutionTimeMinutes: number;
  successProbability: number;
  rank: number;
  isTopSuggestion: boolean;
}

export interface CaseResolutionsDto {
  caseId: string;
  resolutions: ResolutionSuggestionDto[];
}
