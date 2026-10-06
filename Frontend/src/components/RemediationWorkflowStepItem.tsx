import React from "react";
import { RemediationWorkflowStepViewModel } from "../types/remediationWorkflow";

interface Props {
    step: RemediationWorkflowStepViewModel;
    onStatusChange: (stepInstanceId: string, status: string) => void;
}

export const RemediationWorkflowStepItem: React.FC<Props> = ({ step, onStatusChange }) => {
    const onStart = () => onStatusChange(step.stepInstanceId, "InProgress");
    const onComplete = () => onStatusChange(step.stepInstanceId, "Completed");

    return (
        <div className="list-group-item d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <div>
                    <span className="fw-bold me-2">{step.title}</span>
                    {step.isRequired && <span className="badge bg-danger">Required</span>}
                </div>
                <span className="badge bg-secondary">{step.status}</span>
            </div>
            <p className="mb-2">{step.description}</p>
            <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={onStart} disabled={step.status === "InProgress" || step.status === "Completed"}>
                    Start
                </button>
                <button className="btn btn-sm btn-success" onClick={onComplete} disabled={step.status === "Completed"}>
                    Complete
                </button>
            </div>
        </div>
    );
};
