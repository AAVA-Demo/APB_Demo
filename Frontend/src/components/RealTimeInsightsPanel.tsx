import React from "react";
import { useInsightUpdates } from "../hooks/useInsightUpdates";

export interface RealTimeInsightsPanelProps {
    caseId: string;
}

export const RealTimeInsightsPanel: React.FC<RealTimeInsightsPanelProps> = ({ caseId }) => {
    const { data, loading, error, connected, reload } = useInsightUpdates(caseId);

    const formattedTime = data
        ? new Date(data.lastUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "--:--";

    return (
        <div className="p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <h5 className="mb-0">AI Diagnostic Insights</h5>
                    <small className="text-muted">
                        Updated at {formattedTime} {loading && <span className="ms-1">(Refreshing)</span>}
                    </small>
                </div>
                <div className="text-end">
                    <div className="small mb-1">
                        Connection: {connected ? "Connected" : "Disconnected"}
                    </div>
                    <button className="btn btn-sm btn-outline-secondary" onClick={reload}>
                        Retry
                    </button>
                </div>
            </div>
            {loading && <div className="text-center py-2">Loading...</div>}
            {error && <div className="alert alert-danger mb-2">{error}</div>}
            {!loading && !error && data && data.insights.length === 0 && (
                <div className="text-muted">No insights available.</div>
            )}
            {!loading && !error && data && data.insights.length > 0 && (
                <div className="list-group">
                    {data.insights.map(insight => (
                        <div
                            key={insight.insightId}
                            className="list-group-item d-flex flex-column"
                        >
                            <div className="d-flex justify-content-between">
                                <span className="fw-bold">{insight.title}</span>
                                <span className="badge bg-primary">{insight.priority}</span>
                            </div>
                            <div className="small text-muted mt-1">{insight.summary}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
