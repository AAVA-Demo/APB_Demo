import React from "react";
import { useIssueSummary } from "../hooks/useIssueSummary";
import { IssueSummaryText } from "./IssueSummaryText";

interface Props {
  memberId: string;
  issueId: string;
}

export const IssueSummaryPanel: React.FC<Props> = ({ memberId, issueId }) => {
  const { summary, loading, error } = useIssueSummary(memberId, issueId);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Issue Summary</h5>
        {loading && <div className="spinner-border" role="status" />}
        {error && (
          <div className="alert alert-warning mt-2" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && summary && (
          <IssueSummaryText
            summaryText={summary.summaryText}
            likelyCause={summary.likelyCause}
          />
        )}
        {!loading && !error && !summary && (
          <p className="text-muted mb-0">Summary unavailable.</p>
        )}
      </div>
    </div>
  );
};
