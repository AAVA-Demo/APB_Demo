import React from "react";
import { useCaseSummary } from "../hooks/useCaseSummary";

interface Props {
    caseId: string;
}

export const CaseSummaryPanel: React.FC<Props> = ({ caseId }) => {
    const { summary, loading, error } = useCaseSummary(caseId);

    if (loading) {
        return <div className="p-2 text-muted">Loading case summary...</div>;
    }

    if (error) {
        return <div className="alert alert-warning p-2 mb-0">{error}</div>;
    }

    if (!summary) {
        return <div className="p-2 text-muted">No summary available.</div>;
    }

    return (
        <div className="border rounded p-2">
            <h6 className="fw-bold mb-1">Case Summary</h6>
            <p className="mb-1">{summary.summaryText}</p>
            {summary.impactDescription && (
                <p className="mb-1 text-muted">Impact: {summary.impactDescription}</p>
            )}
            <small className="text-muted">Last updated: {new Date(summary.lastUpdatedUtc).toLocaleString()}</small>
        </div>
    );
};
