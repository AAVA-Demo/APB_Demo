import React from "react";
import { useRootCauseRecommendations } from "../hooks/useRootCauseRecommendations";

interface RootCauseRecommendationsPanelProps {
    caseId: string;
}

export const RootCauseRecommendationsPanel: React.FC<RootCauseRecommendationsPanelProps> = ({ caseId }) => {
    const { data, loading, error } = useRootCauseRecommendations(caseId);

    if (loading) {
        return <div className="p-3">Loading root cause recommendations...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!data || data.recommendations.length === 0) {
        return (
            <div className="p-3 border rounded">
                <h5 className="mb-2">Root Cause Recommendations</h5>
                <p className="mb-0 text-muted">No recommendations available.</p>
            </div>
        );
    }

    return (
        <div className="p-3 border rounded">
            <h5 className="mb-3">Root Cause Recommendations</h5>
            <ol className="mb-0">
                {data.recommendations.map(rec => (
                    <li key={rec.id} className="mb-2">
                        <div className="mb-1">{rec.description}</div>
                        <div className="small">
                            <span className="badge bg-info me-2">Likelihood: {rec.likelihoodScore}</span>
                            <span className="badge bg-warning text-dark me-2">Impact: {rec.impactScore}</span>
                            <span className="badge bg-secondary">Priority: {rec.priorityRank}</span>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};
