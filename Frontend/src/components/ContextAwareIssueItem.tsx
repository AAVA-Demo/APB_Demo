import React from "react";
import { ContextAwareIssueViewModel } from "../types/contextAwareIssues";

interface Props {
    issue: ContextAwareIssueViewModel;
}

export const ContextAwareIssueItem: React.FC<Props> = ({ issue }) => {
    return (
        <div className="list-group-item mb-1">
            <div className="d-flex justify-content-between">
                <h5 className="mb-1">{issue.title}</h5>
                <span className="badge bg-warning text-dark">{issue.severity}</span>
            </div>
            <p className="mb-1">{issue.description}</p>
            <small className="text-muted">{issue.recommendationSummary}</small>
        </div>
    );
};
