import React from "react";
import { ContextAwareIssueViewModel } from "../types/contextAwareIssues";
import { ContextAwareIssueItem } from "./ContextAwareIssueItem";

interface Props {
    issues: ContextAwareIssueViewModel[];
    isLoading: boolean;
}

export const ContextAwareIssuesList: React.FC<Props> = ({ issues, isLoading }) => {
    if (isLoading) {
        return <div className="text-muted">Loading context-aware issues...</div>;
    }

    if (issues.length === 0) {
        return <div className="text-muted">No context-aware issues available.</div>;
    }

    return (
        <div className="list-group mb-3">
            {issues.map(issue => (
                <ContextAwareIssueItem key={issue.issueId} issue={issue} />
            ))}
        </div>
    );
};
