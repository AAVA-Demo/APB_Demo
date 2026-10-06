import React from "react";
import { RemediationWorkflowViewModel, RemediationWorkflowStepViewModel } from "../types/remediationWorkflow";
import { RemediationWorkflowStepList } from "./RemediationWorkflowStepList";

interface Props {
    caseId: string;
    issueId: string;
    workflow: RemediationWorkflowViewModel | null;
    isLoading: boolean;
    onUpdateStepStatus: (stepInstanceId: string, status: string) => void;
}

export const RemediationWorkflowPanel: React.FC<Props> = ({ workflow, isLoading, onUpdateStepStatus }) => {
    if (isLoading) {
        return <div className="text-muted">Loading remediation workflow...</div>;
    }

    if (!workflow) {
        return <div className="text-muted">No remediation workflow available.</div>;
    }

    const steps: RemediationWorkflowStepViewModel[] = workflow.steps;

    return (
        <div className="mb-3">
            <h4>Remediation Workflow</h4>
            <RemediationWorkflowStepList steps={steps} onUpdateStepStatus={onUpdateStepStatus} />
        </div>
    );
};
