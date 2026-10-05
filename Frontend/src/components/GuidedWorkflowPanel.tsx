import React from 'react';
import { useGuidedWorkflow } from '../hooks/useGuidedWorkflow';
import { WorkflowStepItem } from './WorkflowStepItem';

interface GuidedWorkflowPanelProps {
    issueId: string;
}

export const GuidedWorkflowPanel: React.FC<GuidedWorkflowPanelProps> = ({ issueId }) => {
    const { workflow, loading, error, completeStep } = useGuidedWorkflow(issueId);

    return (
        <div className="mt-3">
            <h4 className="mb-2">Guided Workflow</h4>
            {error && (
                <div className="alert alert-danger" role="alert">
                    Workflow error: {error}
                </div>
            )}
            {loading && (
                <div className="text-center my-2">
                    <div className="spinner-border" role="status" />
                </div>
            )}
            {!loading && !workflow && !error && (
                <div className="alert alert-info" role="alert">
                    No workflow defined for this issue.
                </div>
            )}
            {workflow && (
                <>
                    <p className="mb-2 text-muted">{workflow.description}</p>
                    <ol className="ps-3">
                        {workflow.steps.map((step) => (
                            <WorkflowStepItem key={step.id} step={step} onToggle={() => completeStep(step)} />
                        ))}
                    </ol>
                </>
            )}
        </div>
    );
};
