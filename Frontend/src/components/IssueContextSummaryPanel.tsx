import React from "react";
import { IssueContextSummaryResponse } from "../types/issueContextSummary";

interface Props {
    response: IssueContextSummaryResponse | null;
    loading: boolean;
    error: string | null;
}

export const IssueContextSummaryPanel: React.FC<Props> = ({ response, loading, error }) => {
    if (loading) {
        return <div className="text-muted small">Loading issue context summary...</div>;
    }

    if (error) {
        return <div className="alert alert-secondary py-1 my-0">{error}</div>;
    }

    if (!response) {
        return <div className="text-muted small">No issue context summary available.</div>;
    }

    return (
        <div className="border rounded p-2 d-flex flex-column gap-2">
            <div>
                <div className="fw-semibold mb-1">Issue Summary</div>
                <div className="small">{response.summaryText}</div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-3">
                <div className="flex-fill">
                    <div className="fw-semibold small mb-1">Recent Events</div>
                    <ul className="mb-0 small">
                        {response.recentEvents.map((e, idx) => (
                            <li key={idx}>{new Date(e.timestamp).toLocaleString()} - {e.description}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex-fill">
                    <div className="fw-semibold small mb-1">Key Indicators</div>
                    <div className="small">
                        {response.keyIndicators.map((k, idx) => (
                            <div key={idx} className="d-flex justify-content-between">
                                <span>{k.name}</span>
                                <span className="fw-semibold">{k.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
