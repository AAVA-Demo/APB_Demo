import React, { useState } from "react";
import { useContextAwareInsights } from "../hooks/useContextAwareInsights";

interface ContextAwareInsightsPanelProps {
    memberId: string;
    caseId: string;
}

export const ContextAwareInsightsPanel: React.FC<ContextAwareInsightsPanelProps> = ({ memberId, caseId }) => {
    const { data, loading, error } = useContextAwareInsights(memberId, caseId);
    const [showHistory, setShowHistory] = useState<boolean>(false);

    if (loading) {
        return <div className="p-3">Loading context-aware insights...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!data) {
        return (
            <div className="p-3 border rounded">
                <h5 className="mb-2">Context-Aware Insights</h5>
                <p className="mb-0 text-muted">No data available.</p>
            </div>
        );
    }

    return (
        <div className="p-3 border rounded">
            <h5 className="mb-3">Context-Aware Insights</h5>
            <ul className="list-unstyled mb-3">
                {data.insights.map((insight, index) => (
                    <li key={index} className="mb-2">{insight}</li>
                ))}
            </ul>
            <button
                className="btn btn-sm btn-outline-secondary mb-2"
                onClick={() => setShowHistory(h => !h)}
            >
                {showHistory ? "Hide history" : "Show referenced history"}
            </button>
            {showHistory && (
                <ul className="list-unstyled mb-0">
                    {data.referencedHistory.map(event => (
                        <li key={event.eventId} className="mb-2">
                            <div>{event.summary}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
