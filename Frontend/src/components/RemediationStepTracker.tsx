import React from "react";
import { useRemediationStepTracker } from "../hooks/useRemediationStepTracker";
import { RemediationStepList } from "./RemediationStepList";

interface Props {
  issueId: string;
  agentId: string;
}

export const RemediationStepTracker: React.FC<Props> = ({ issueId, agentId }) => {
  const { steps, nextStepId, loading, error, completeStep } =
    useRemediationStepTracker(issueId, agentId);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Remediation Step Tracker</h5>
        {loading && <div className="spinner-border" role="status" />}
        {error && (
          <div className="alert alert-warning mt-2" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && steps.length === 0 && (
          <p className="text-muted mb-0">No remediation steps.</p>
        )}
        {!loading && !error && steps.length > 0 && (
          <RemediationStepList
            steps={steps}
            onCompleteStep={completeStep}
            nextStepId={nextStepId}
          />
        )}
      </div>
    </div>
  );
};
