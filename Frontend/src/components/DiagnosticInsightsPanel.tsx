import React from "react";
import { useDiagnosticInsights } from "../hooks/useDiagnosticInsights";

export interface DiagnosticInsightsPanelProps {
    caseId: string;
}

export const DiagnosticInsightsPanel: React.FC<DiagnosticInsightsPanelProps> = ({ caseId }) => {
    const { data, loading, error, reload } = useDiagnosticInsights(caseId);

    return (
        <div className="p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">AI Diagnostic Insights</h5>
                <button className="btn btn-sm btn-outline-secondary" onClick={reload}>
                    Refresh
                </button>
            </div>
            {loading && <div className="text-center py-3">Loading...</div>}
            {error && (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{error}</span>
                    <button className="btn btn-sm btn-light" onClick={reload}>
                        Retry
                    </button>
                </div>
            )}
            {!loading && !error && data && data.insights.length === 0 && (
                <div className="text-muted">No insights available.</div>
            )}
            {!loading && !error && data && data.insights.length > 0 && (
                <div className="list-group">
                    {data.insights.map(insight => (
                        <button
                            key={insight.insightId}
                            type="button"
                            className="list-group-item list-group-item-action"
                        >
                            <div className="fw-bold">{insight.title}</div>
                            <div className="small text-muted">{insight.summary}</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
