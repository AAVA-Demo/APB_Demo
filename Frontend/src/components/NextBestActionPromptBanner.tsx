import React from 'react';
import { NextBestActionPromptBannerProps } from '../types/nextBestAction';
import { useNextBestActionPrompt } from '../hooks/useNextBestActionPrompt';

export const NextBestActionPromptBanner: React.FC<NextBestActionPromptBannerProps> = ({ memberIssueId }) => {
    const { prompt, loading, error } = useNextBestActionPrompt(memberIssueId);

    if (loading) {
        return <div className="alert alert-info">Loading next best action...</div>;
    }

    if (error) {
        return <div className="alert alert-warning">{error}</div>;
    }

    if (!prompt || !prompt.hasRecommendation) {
        return <div className="alert alert-secondary">No recommended next action at this time.</div>;
    }

    return (
        <div className="alert alert-primary">
            <strong>Next best action:</strong> {prompt.promptText} (Code: {prompt.recommendedStepCode})
        </div>
    );
};
