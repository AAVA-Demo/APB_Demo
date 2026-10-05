export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: number;
}

export interface RecommendationContextRequest {
  memberId: string;
  currentIssueSummary: string;
}
