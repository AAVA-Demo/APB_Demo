import React from "react";
import { RemediationWorkflowStepViewModel } from "../types/remediationWorkflow";
import { RemediationWorkflowStepItem } from "./RemediationWorkflowStepItem";

interface Props {
    steps: RemediationWorkflowStepViewModel[];
    onUpdateStepStatus: (stepInstanceId: string, status: string) => void;
}

export const RemediationWorkflowStepList: React.FC<Props> = ({ steps, onUpdateStepStatus }) => {
    if (steps.length === 0) {
        return <div className="text-muted">No remediation steps available.</div>;
    }

    return (
        <div className="list-group mb-2">
            {steps.map(step => (
                <RemediationWorkflowStepItem key={step.stepInstanceId} step={step} onStatusChange={onUpdateStepStatus} />
            ))}
        </div>
    );
};
