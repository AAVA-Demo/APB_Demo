import React from 'react';
import { useGuidedWorkflow } from '../hooks/useGuidedWorkflow';
import { WorkflowStepList } from './WorkflowStepList';

interface Props {
  issueId: string;
}

export const GuidedWorkflowPanel: React.FC<Props> = ({ issueId }) => {
  const { workflow, loading, error, completeStep } = useGuidedWorkflow(issueId);

  if (loading && !workflow) {
    return <div className="p-3 text-center">Loading workflow...</div>;
  }

  if (error && !workflow) {
    return <div className="alert alert-warning p-2">{error}</div>;
  }

  if (!workflow) {
    return <div className="p-3 text-muted">No workflow available.</div>;
  }

  const current = workflow.steps[workflow.currentStepIndex];

  return (
    <div className="p-3 border rounded mt-3">
      <div className="mb-3">
        <h5 className="mb-1">Guided Workflow</h5>
        <small className="text-muted">{workflow.name}</small>
      </div>
      {current && (
        <div className="mb-3">
          <h6>Current Step: {current.title}</h6>
          <p className="mb-2 small text-muted">{current.description}</p>
          <button
            className="btn btn-primary btn-sm"
            type="button"
            onClick={() => completeStep(current)}
          >
            Mark as Done
          </button>
        </div>
      )}
      <WorkflowStepList workflow={workflow} />
      {loading && <div className="small text-muted mt-2">Updating workflow...</div>}
      {error && <div className="alert alert-warning mt-2 p-2">{error}</div>}
    </div>
  );
};
