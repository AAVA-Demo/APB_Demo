import React from "react";
import type { DiagnosticInsight } from "../types/diagnosticInsights";

interface Props {
    insight: DiagnosticInsight;
}

export const DiagnosticInsightItem: React.FC<Props> = ({ insight }) => {
    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-between">
                <span className="fw-semibold">{insight.title}</span>
                <span className="badge bg-secondary">{Math.round(insight.relevanceScore * 100)}%</span>
            </div>
            <small className="text-muted">{insight.description}</small>
        </div>
    );
};
