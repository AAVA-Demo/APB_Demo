export interface RecommendationDto {
  id: string;
  text: string;
  referencedSymptoms: string[];
  referencedInteractions: string[];
}

export interface ContextAwareRecommendationsDto {
  caseId: string;
  symptoms: string[];
  recentInteractions: string[];
  recommendations: RecommendationDto[];
}
