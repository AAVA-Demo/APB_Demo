import React from "react";
import { useEffect, useState } from "react";
import { getPrioritizedInsights } from "../api/insightsApi";
import { InsightListDto } from "../types/insights";

export interface InsightListPanelProps {
    caseId: string;
}

interface InsightListItemProps {
    insightId: string;
    title: string;
    priority: string;
    summary: string;
}

const InsightListItem: React.FC<InsightListItemProps> = ({ title, priority, summary }) => {
    const borderClass =
        priority === "High" ? "border-danger" : priority === "Medium" ? "border-warning" : "border-secondary";

    return (
        <button type="button" className={`list-group-item list-group-item-action border-start-4 ${borderClass}`}>
            <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">{title}</span>
                {priority === "High" && (
                    <span className="badge bg-danger ms-2">High Priority</span>
                )}
            </div>
            <div className="small text-muted mt-1">{summary}</div>
        </button>
    );
};

export const InsightListPanel: React.FC<InsightListPanelProps> = ({ caseId }) => {
    const [data, setData] = useState<InsightListDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        setError(null);
        getPrioritizedInsights(caseId)
            .then(setData)
            .catch(err => setError(err.message ?? "Unable to load insights"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (caseId) {
            load();
        }
    }, [caseId]);

    return (
        <div className="p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Insights</h5>
                <button className="btn btn-sm btn-outline-secondary" onClick={load}>
                    Refresh
                </button>
            </div>
            {loading && <div className="text-center py-2">Loading...</div>}
            {error && (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>Unable to load insights</span>
                    <button className="btn btn-sm btn-light" onClick={load}>
                        Retry
                    </button>
                </div>
            )}
            {!loading && !error && data && data.insights.length === 0 && (
                <div className="text-muted">No insights available.</div>
            )}
            {!loading && !error && data && data.insights.length > 0 && (
                <div className="list-group">
                    {data.insights.map(i => (
                        <InsightListItem
                            key={i.insightId}
                            insightId={i.insightId}
                            title={i.title}
                            priority={i.priority}
                            summary={i.summary}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
