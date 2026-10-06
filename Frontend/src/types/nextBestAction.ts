export interface NextBestActionPromptDto {
    memberIssueId: string;
    hasRecommendation: boolean;
    promptText: string;
    recommendedStepCode: string;
}

export interface NextBestActionPromptBannerProps {
    memberIssueId: string;
}
