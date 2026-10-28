export interface AiInsight {
  insightId: string;
  title: string;
  description: string;
  confidenceScore: number;
  confidenceLevel: string;
}

export interface AiInsightsResponseDto {
  interactionId: string;
  insights: AiInsight[];
}
