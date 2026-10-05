import React, { useState } from "react";
import { MemberImpactIssueViewModel } from "../types/memberImpact";
import { MemberImpactRecommendationList } from "./MemberImpactRecommendationList";

interface Props {
  issues: MemberImpactIssueViewModel[];
}

export const MemberImpactIssueList: React.FC<Props> = ({ issues }) => {
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);

  return (
    <div className="list-group">
      {issues.map((issue) => (
        <div key={issue.issueId} className="list-group-item">
          <div
            className="d-flex justify-content-between align-items-center"
            role="button"
            onClick={() =>
              setExpandedIssueId(
                expandedIssueId === issue.issueId ? null : issue.issueId
              )
            }
          >
            <div>
              <div className="fw-semibold">{issue.title}</div>
              <small className="text-muted">
                Score: {issue.impactScore.toFixed(2)}
              </small>
            </div>
            <span className="badge bg-primary">{issue.impactLabel}</span>
          </div>
          {expandedIssueId === issue.issueId && (
            <div className="mt-2">
              <MemberImpactRecommendationList
                recommendations={[]}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
