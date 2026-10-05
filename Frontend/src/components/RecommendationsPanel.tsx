import React from "react";
import { Recommendation } from "../types/recommendation";
import { RecommendationItem } from "./RecommendationItem";

interface RecommendationsPanelProps {
    recommendations: Recommendation[];
    loading: boolean;
    error: string | null;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
    recommendations,
    loading,
    error,
}) => {
    if (loading) {
        return <div className="text-muted">Loading recommendations...</div>;
    }

    if (error) {
        return <div className="alert alert-warning p-2">{error}</div>;
    }

    if (!recommendations.length) {
        return <div className="text-muted">No recommendations available.</div>;
    }

    return (
        <ul className="list-group">
            {recommendations.map((rec) => (
                <RecommendationItem key={rec.id} recommendation={rec} />
            ))}
        </ul>
    );
};
