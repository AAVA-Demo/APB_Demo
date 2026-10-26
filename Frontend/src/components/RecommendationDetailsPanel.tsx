import React, { useState } from "react";
import { useRecommendationExplanation } from "../hooks/useRecommendationExplanation";

export interface RecommendationDetailsPanelProps {
    caseId: string;
    insightId: string;
    recommendationId: string;
    onExpanded?: () => void;
}

export const RecommendationDetailsPanel: React.FC<RecommendationDetailsPanelProps> = ({
    caseId,
    insightId,
    recommendationId,
    onExpanded
}) => {
    const [expanded, setExpanded] = useState(false);
    const { data, loading, error, load } = useRecommendationExplanation(
        caseId,
        insightId,
        recommendationId
    );

    const toggle = () => {
        if (!expanded) {
            load();
            if (onExpanded) {
                onExpanded();
            }
        }
        setExpanded(!expanded);
    };

    return (
        <div className="p-3 border rounded mt-3">
            <button className="btn btn-link p-0 w-100 text-start" onClick={toggle}>
                <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Recommendation</span>
                    <span>{expanded ? "Collapse" : "Expand"}</span>
                </div>
            </button>
            {expanded && (
                <div className="mt-2">
                    {loading && <div className="small text-muted">Loading explanation...</div>}
                    {error && (
                        <div className="alert alert-danger">Unable to load explanation</div>
                    )}
                    {!loading && !error && data && (
                        <div className="row g-3">
                            <div className="col-12 col-lg-6">
                                <h6 className="fw-bold">Why this is suggested</h6>
                                <p className="mb-0">{data.explanation}</p>
                            </div>
                            <div className="col-12 col-lg-6">
                                <h6 className="fw-bold">How this helps</h6>
                                <ol className="mb-0">
                                    {data.steps.map((s, idx) => (
                                        <li key={idx}>{s}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
