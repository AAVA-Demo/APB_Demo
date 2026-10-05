import React from "react";
import { useRemediationSteps } from "../hooks/useRemediationSteps";
import { RemediationStepListView } from "./RemediationStepListView";

interface Props {
  memberId: string;
  issueId: string;
}

export const RemediationStepListPanel: React.FC<Props> = ({
  memberId,
  issueId,
}) => {
  const { steps, loading, error } = useRemediationSteps(memberId, issueId);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">AI-Guided Steps</h5>
        {loading && <div className="spinner-border" role="status" />}
        {error && (
          <div className="alert alert-warning mt-2" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && steps.length === 0 && (
          <p className="text-muted mb-0">No remediation steps available.</p>
        )}
        {!loading && !error && steps.length > 0 && (
          <RemediationStepListView steps={steps} />
        )}
      </div>
    </div>
  );
};
