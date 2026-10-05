import React from "react";
import { GuidedResolutionStepItem } from "./GuidedResolutionStepItem";
import type { GuidedResolutionWorkflow } from "../types/guidedResolution";

interface Props {
    workflow: GuidedResolutionWorkflow;
    onUpdateStepStatus: (stepId: string, newStatus: string) => void;
}

export const GuidedResolutionStepsList: React.FC<Props> = ({ workflow, onUpdateStepStatus }) => {
    return (
        <div>
            <div className="d-flex justify-content-between mb-2">
                <h6 className="fw-bold mb-0">Guided Resolution Steps</h6>
                <span className="badge bg-primary">Status: {workflow.status}</span>
            </div>
            <ol className="mb-0 ps-3">
                {workflow.steps.map((step) => (
                    <li key={step.id} className="mb-2">
                        <GuidedResolutionStepItem step={step} onUpdateStatus={onUpdateStepStatus} />
                    </li>
                ))}
            </ol>
        </div>
    );
};
