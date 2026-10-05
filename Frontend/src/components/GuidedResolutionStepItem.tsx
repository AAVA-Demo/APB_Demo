import React from "react";
import type { GuidedResolutionStep } from "../types/guidedResolution";

interface Props {
    step: GuidedResolutionStep;
    onUpdateStatus: (stepId: string, newStatus: string) => void;
}

export const GuidedResolutionStepItem: React.FC<Props> = ({ step, onUpdateStatus }) => {
    const handleComplete = () => onUpdateStatus(step.id, "Completed");
    const handleEscalate = () => onUpdateStatus(step.id, "Escalated");

    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className={step.status === "Completed" ? "text-decoration-line-through" : ""}>
                    {step.title}
                </span>
                <span className="badge bg-secondary text-capitalize">{step.status.toLowerCase()}</span>
            </div>
            {step.description && (
                <small className="text-muted mb-1">{step.description}</small>
            )}
            <div className="d-flex gap-2">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                    onClick={handleComplete}
                    disabled={step.status === "Completed"}
                >
                    Mark complete
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleEscalate}
                >
                    Escalate
                </button>
            </div>
        </div>
    );
};
