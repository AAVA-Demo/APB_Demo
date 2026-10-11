import React, { useState } from "react";
import { useRemediationSteps } from "../hooks/useRemediationSteps";
import { RemediationStepList } from "./RemediationStepList";

interface Props {
  caseId: string;
}

export const RemediationStepsSection: React.FC<Props> = ({ caseId }) => {
  const { data, loading, error } = useRemediationSteps(caseId);
  const [completed, setCompleted] = useState<number[]>([]);

  const toggleCompleted = (stepNumber: number) => {
    setCompleted((prev) =>
      prev.includes(stepNumber) ? prev.filter((n) => n !== stepNumber) : [...prev, stepNumber]
    );
  };

  return (
    <div className="p-3 border rounded mb-3">
      <h5>Remediation Steps</h5>
      {loading && <div className="text-center py-3 spinner-border" />}
      {error && <div className="alert alert-danger p-2 mb-2">{error}</div>}
      {data && (
        <RemediationStepList
          issuePatternId={data.issuePatternId}
          steps={data.steps}
          completed={completed}
          onToggleCompleted={toggleCompleted}
        />
      )}
      {!loading && !error && data && data.steps.length === 0 && (
        <div className="text-muted">No steps available.</div>
      )}
    </div>
  );
};
