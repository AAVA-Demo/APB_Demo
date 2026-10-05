import React from "react";
import { Recommendation } from "../types/recommendation";

interface RecommendationItemProps {
    recommendation: Recommendation;
}

export const RecommendationItem: React.FC<RecommendationItemProps> = ({
    recommendation,
}) => {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <div className="fw-bold">{recommendation.title}</div>
                <div className="small text-muted">{recommendation.description}</div>
            </div>
            <div className="text-end">
                <div className="badge bg-primary mb-1">
                    Impact {recommendation.impactScore}
                </div>
                <div className="badge bg-danger ms-1 mb-1">
                    Urgency {recommendation.urgencyScore}
                </div>
                <div className="small text-muted">Rank {recommendation.priorityRank}</div>
            </div>
        </li>
    );
};
