export interface InsightDto {
    id: string;
    title: string;
    description: string;
}

export interface RecommendationDto {
    id: string;
    text: string;
}

export interface InsightUpdateDto {
    interactionId: string;
    updatedAt: string;
    insights: InsightDto[];
    recommendations: RecommendationDto[];
}
