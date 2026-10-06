export interface RecommendationDto {
    code: string;
    title: string;
    description: string;
    priority: string;
}

export interface RecommendationSetDto {
    caseId: string;
    memberId: string;
    recommendations: RecommendationDto[];
}
