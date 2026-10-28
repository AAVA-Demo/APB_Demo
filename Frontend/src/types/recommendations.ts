export interface Recommendation {
  recommendationId: string;
  title: string;
  description: string;
  contextSummary: string;
}

export interface ContextAwareRecommendationsResponseDto {
  interactionId: string;
  accountId: string;
  caseId: string;
  recommendations: Recommendation[];
}
