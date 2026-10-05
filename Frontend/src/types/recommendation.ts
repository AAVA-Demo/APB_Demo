export interface RankedRecommendationDto {
    id: string;
    description: string;
    confidence: number;
    rank: number;
}

export interface RankedRecommendationResponseDto {
    interactionId: string;
    recommendations: RankedRecommendationDto[];
}
