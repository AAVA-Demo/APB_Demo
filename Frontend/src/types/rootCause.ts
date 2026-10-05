export interface RootCauseRecommendation {
    id: string;
    description: string;
    likelihoodScore: number;
    impactScore: number;
    priorityRank: number;
}

export interface RootCauseRecommendationResponse {
    caseId: string;
    recommendations: RootCauseRecommendation[];
}
