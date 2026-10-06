export interface RecommendationDto {
    recommendationId: string;
    title: string;
    description: string;
    contextSummary: string;
}

export interface ContextRecommendationsDto {
    memberIssueId: string;
    recommendations: RecommendationDto[];
}

export interface ContextRecommendationsListProps {
    memberIssueId: string;
}

export interface ContextRecommendationItemProps {
    recommendationId: string;
    title: string;
    description: string;
    contextSummary: string;
}
