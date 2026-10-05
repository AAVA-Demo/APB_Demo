import React from "react";
import { useMemberImpact } from "../hooks/useMemberImpact";
import { MemberImpactIssueList } from "./MemberImpactIssueList";

interface Props {
  memberId: string;
}

export const DiagnosticPanelImpactList: React.FC<Props> = ({ memberId }) => {
  const { issues, loading, error } = useMemberImpact(memberId);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Impact Prioritized Issues</h5>
        {loading && <div className="spinner-border" role="status" />}
        {error && (
          <div className="alert alert-warning mt-2" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && issues.length === 0 && (
          <p className="text-muted mb-0">No issues found for member.</p>
        )}
        {!loading && !error && issues.length > 0 && (
          <MemberImpactIssueList issues={issues} />
        )}
      </div>
    </div>
  );
};
