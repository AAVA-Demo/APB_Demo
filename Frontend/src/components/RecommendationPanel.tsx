import React from "react";
import { useRankedRecommendations } from "../hooks/useRankedRecommendations";
import { RankedRecommendationList } from "./RankedRecommendationList";

interface Props {
    interactionId: string;
}

export const RecommendationPanel: React.FC<Props> = ({ interactionId }) => {
    const { data, loading, error } = useRankedRecommendations(interactionId);

    if (loading) {
        return <div className="p-3">Loading recommendations...</div>;
    }

    if (error) {
        return <div className="alert alert-danger p-2">{error}</div>;
    }

    if (!data) {
        return <div className="text-muted p-2">No recommendations available at this time.</div>;
    }

    return (
        <div className="p-3">
            <h5 className="mb-3">Recommendations</h5>
            <RankedRecommendationList recommendations={data.recommendations} />
        </div>
    );
};
