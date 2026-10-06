import React from "react";
import { MemberContextSummaryViewModel } from "../types/contextAwareIssues";

interface Props {
    summary: MemberContextSummaryViewModel | null;
    isLoading: boolean;
}

export const MemberContextSummaryPanel: React.FC<Props> = ({ summary, isLoading }) => {
    if (isLoading) {
        return <div className="text-muted">Loading member context summary...</div>;
    }

    if (!summary) {
        return <div className="text-muted">No member context summary available.</div>;
    }

    return (
        <div className="mb-3">
            <h4>Member Context Summary</h4>
            <p className="mb-1">{summary.summaryText}</p>
            <small className="text-muted">Member: {summary.memberId}</small>
        </div>
    );
};
