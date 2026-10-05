import React from "react";
import { MemberIssueSummary } from "../types/memberIssueSummary";

interface MemberIssueSummaryHeaderProps {
    summary: MemberIssueSummary | null;
    loading: boolean;
    error: string | null;
}

export const MemberIssueSummaryHeader: React.FC<MemberIssueSummaryHeaderProps> = ({
    summary,
    loading,
    error,
}) => {
    if (loading) {
        return <div className="placeholder-glow bg-light p-3 rounded">Loading summary...</div>;
    }

    if (error) {
        return <div className="alert alert-warning p-2">{error}</div>;
    }

    if (!summary) {
        return <div className="text-muted">No member issue summary available.</div>;
    }

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title mb-1">Member Issue Summary</h5>
                        <p className="card-text mb-1">{summary.summaryText}</p>
                    </div>
                    <div className="text-end">
                        <span className="badge bg-info mb-1">{summary.currentStatus}</span>
                        <div className="small text-muted">
                            Last updated {new Date(summary.lastUpdatedAt).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
