import React from "react";
import { IssueSeverityDto } from "../types/issueSeverity";

interface Props {
    issue: IssueSeverityDto;
    selected: boolean;
    onSelect: () => void;
}

export const IssueSeverityCard: React.FC<Props> = ({ issue, selected, onSelect }) => {
    const badgeClass = issue.severity === "Critical"
        ? "bg-danger"
        : issue.severity === "High"
        ? "bg-warning text-dark"
        : "bg-secondary";

    return (
        <button
            type="button"
            className={`card text-start w-100 ${selected ? "border-primary" : ""}`}
            onClick={onSelect}
        >
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold">{issue.summary}</span>
                    <span className={`badge ${badgeClass}`}>{issue.severity}</span>
                </div>
                <p className="card-text small mb-0">Issue ID: {issue.issueId}</p>
            </div>
        </button>
    );
};
