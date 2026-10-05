import React from "react";
import { useDiagnosticInsights } from "../hooks/useDiagnosticInsights";

interface DiagnosticInsightsPanelProps {
    caseId: string;
}

export const DiagnosticInsightsPanel: React.FC<DiagnosticInsightsPanelProps> = ({ caseId }) => {
    const { data, loading, error, notifyUpdate } = useDiagnosticInsights(caseId);

    const onRefresh = async () => {
        await notifyUpdate({ changeType: "CASE_UPDATE", changedFields: ["all"] });
    };

    if (loading) {
        return <div className="d-flex justify-content-center p-3">Loading insights...</div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="btn btn-sm btn-light" onClick={onRefresh}>Retry</button>
            </div>
        );
    }

    if (!data || data.insights.length === 0) {
        return (
            <div className="p-3 border rounded">
                <div className="d-flex justify-content-between mb-2">
                    <h5 className="mb-0">Diagnostic Insights</h5>
                    <button className="btn btn-sm btn-outline-primary" onClick={onRefresh}>Refresh</button>
                </div>
                <p className="mb-0 text-muted">No insights available.</p>
            </div>
        );
    }

    return (
        <div className="p-3 border rounded">
            <div className="d-flex justify-content-between mb-2">
                <h5 className="mb-0">Diagnostic Insights</h5>
                <button className="btn btn-sm btn-outline-primary" onClick={onRefresh}>Refresh</button>
            </div>
            <ul className="list-unstyled mb-0">
                {data.insights.map((insight, index) => (
                    <li key={index} className="mb-2">
                        <div className="small text-muted">{new Date(data.generatedAt).toLocaleString()}</div>
                        <div>{insight}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
