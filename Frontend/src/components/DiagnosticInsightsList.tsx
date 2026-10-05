import React from "react";
import { DiagnosticInsight } from "../types/diagnostic";

interface DiagnosticInsightsListProps {
    insights: DiagnosticInsight[];
    loading: boolean;
    error: string | null;
}

export const DiagnosticInsightsList: React.FC<DiagnosticInsightsListProps> = ({
    insights,
    loading,
    error,
}) => {
    if (loading) {
        return <div className="text-muted">Loading diagnostic insights...</div>;
    }

    if (error) {
        return <div className="alert alert-warning p-2">{error}</div>;
    }

    if (!insights.length) {
        return <div className="text-muted">No diagnostic insights available.</div>;
    }

    return (
        <ul className="list-group">
            {insights.map((insight) => (
                <li key={insight.id} className="list-group-item">
                    <div className="d-flex justify-content-between">
                        <strong>{insight.category}</strong>
                        <span className="badge bg-secondary">{insight.severity}</span>
                    </div>
                    <div className="small mt-1">{insight.description}</div>
                    <div className="small text-muted mt-1">
                        Generated at {new Date(insight.generatedAt).toLocaleString()}
                    </div>
                </li>
            ))}
        </ul>
    );
};
