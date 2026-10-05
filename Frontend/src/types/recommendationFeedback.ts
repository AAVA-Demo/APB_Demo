export interface RecommendationFeedbackRequest {
    caseId: string;
    memberId: string;
    feedbackType: "HELPFUL" | "NOT_HELPFUL";
    comment?: string;
}

export interface RecommendationFeedbackResponse {
    recommendationId: string;
    feedbackType: "HELPFUL" | "NOT_HELPFUL";
    status: string;
    timestamp: string;
}
