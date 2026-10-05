import React from "react";
import { useRecommendations } from "../hooks/useRecommendations";
import { RecommendationItem } from "./RecommendationItem";

interface Props {
    issueId: string;
}

export const RecommendationsList: React.FC<Props> = ({ issueId }) => {
    const { recommendations, loading, error } = useRecommendations(issueId);

    if (loading) {
        return <div className="p-2 text-muted">Loading recommendations...</div>;
    }

    if (error) {
        return <div className="alert alert-warning p-2 mb-0">{error}</div>;
    }

    if (!recommendations.length) {
        return <div className="p-2 text-muted">No recommendations available.</div>;
    }

    return (
        <ul className="list-unstyled mb-0">
            {recommendations.map((r) => (
                <li key={r.id} className="mb-2">
                    <RecommendationItem recommendation={r} />
                </li>
            ))}
        </ul>
    );
};
