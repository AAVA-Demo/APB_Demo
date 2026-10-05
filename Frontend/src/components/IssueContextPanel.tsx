import React from "react";
import { useIssueContextSummary } from "../hooks/useIssueContextSummary";

interface Props {
    caseId: string;
    memberId: string;
}

export const IssueContextPanel: React.FC<Props> = ({ caseId, memberId }) => {
    const { data, loading, error } = useIssueContextSummary(caseId, memberId);

    if (loading) {
        return <div className="p-3">Loading issue context...</div>;
    }

    if (error) {
        return <div className="alert alert-danger p-2">{error}</div>;
    }

    if (!data) {
        return <div className="text-muted p-2">No issue context available.</div>;
    }

    const lastUpdated = new Date(data.lastUpdated).toLocaleString();

    return (
        <div className="p-3 border rounded">
            <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold">Member: {data.memberId}</span>
                <span className="text-muted small">Last updated: {lastUpdated}</span>
            </div>
            <p className="mb-0">{data.summaryText}</p>
        </div>
    );
};
