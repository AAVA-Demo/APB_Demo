import React from "react";
import { IssueSeverityDto } from "../types/issueSeverity";
import { IssueSeverityCard } from "./IssueSeverityCard";

interface Props {
    issues: IssueSeverityDto[];
    onSelectIssue: (issueId: string) => void;
    selectedIssueId: string;
}

export const IssueSeverityList: React.FC<Props> = ({ issues, onSelectIssue, selectedIssueId }) => {
    return (
        <div className="row row-cols-1 row-cols-md-2 g-2">
            {issues.map((issue) => (
                <div className="col" key={issue.issueId}>
                    <IssueSeverityCard
                        issue={issue}
                        selected={issue.issueId === selectedIssueId}
                        onSelect={() => onSelectIssue(issue.issueId)}
                    />
                </div>
            ))}
        </div>
    );
};
