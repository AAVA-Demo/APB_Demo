import React from 'react';
import { useRemediationSteps } from '../hooks/useRemediationSteps';
import { RemediationStepItem } from './RemediationStepItem';

interface Props {
  issueId: string;
}

export const RemediationStepsPanel: React.FC<Props> = ({ issueId }) => {
  const { steps, loading, error } = useRemediationSteps(issueId);

  if (loading) {
    return <div className="p-3 text-center">Loading remediation steps...</div>;
  }

  if (error) {
    return <div className="alert alert-warning p-2">{error}</div>;
  }

  if (!steps.length) {
    return <div className="p-3 text-muted">No remediation steps available.</div>;
  }

  return (
    <div className="p-3 border rounded mt-3">
      <h5 className="mb-3">Remediation Steps</h5>
      <ol className="ps-3 mb-0">
        {steps.map((step, index) => (
          <RemediationStepItem key={step.id} step={step} index={index} />
        ))}
      </ol>
    </div>
  );
};
