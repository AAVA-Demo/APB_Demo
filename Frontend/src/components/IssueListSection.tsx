import React from "react";
import { CaseIssueListDto } from "../types/issueSeverity";
import { IssueSeverityList } from "./IssueSeverityList";

interface Props {
    data: CaseIssueListDto | null;
    loading: boolean;
    error: string | null;
    onSelectIssue: (issueId: string) => void;
    selectedIssueId: string;
}

export const IssueListSection: React.FC<Props> = ({ data, loading, error, onSelectIssue, selectedIssueId }) => {
    return (
        <div className="card mb-3">
            <div className="card-header">Case Issues</div>
            <div className="card-body">
                {loading && <div className="text-center"><div className="spinner-border" /></div>}
                {error && <div className="alert alert-danger mb-2">{error}</div>}
                {!loading && !error && data && data.issues.length > 0 && (
                    <IssueSeverityList
                        issues={data.issues}
                        onSelectIssue={onSelectIssue}
                        selectedIssueId={selectedIssueId}
                    />
                )}
                {!loading && !error && (!data || data.issues.length === 0) && (
                    <p className="text-muted">No issues detected.</p>
                )}
            </div>
        </div>
    );
};
