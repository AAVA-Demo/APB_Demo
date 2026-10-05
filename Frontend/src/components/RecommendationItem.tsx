import React from "react";
import type { Recommendation } from "../types/recommendations";

interface Props {
    recommendation: Recommendation;
}

export const RecommendationItem: React.FC<Props> = ({ recommendation }) => {
    const percentage = Math.round(recommendation.confidenceScore * 100);
    const labelClass =
        percentage >= 80 ? "bg-success" : percentage >= 50 ? "bg-warning text-dark" : "bg-secondary";

    return (
        <div className="border rounded p-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span>{recommendation.text}</span>
                <span className={`badge ${labelClass}`}>{percentage}% confidence</span>
            </div>
            {recommendation.source && (
                <small className="text-muted">Source: {recommendation.source}</small>
            )}
        </div>
    );
};
