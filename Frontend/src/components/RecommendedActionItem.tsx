import React from "react";
import type { RecommendedAction } from "../types/recommendedActions";

interface Props {
    action: RecommendedAction;
}

export const RecommendedActionItem: React.FC<Props> = ({ action }) => {
    return (
        <div className="d-flex flex-column border rounded p-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-semibold">
                    #{action.priorityRank} - {action.title}
                </span>
                {action.isHighImpact && (
                    <span className="badge bg-danger">High impact</span>
                )}
            </div>
            {action.description && (
                <small className="text-muted mb-1">{action.description}</small>
            )}
            <small className="text-muted">Impact score: {Math.round(action.impactScore * 100)}%</small>
        </div>
    );
};
