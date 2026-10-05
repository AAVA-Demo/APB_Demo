import React from "react";
import type { RemediationStep } from "../types/remediationSteps";

interface Props {
    step: RemediationStep;
}

export const RemediationStepItem: React.FC<Props> = ({ step }) => {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <span className="fw-semibold">{step.title}</span>
                {step.category && (
                    <span className="badge bg-info text-dark ms-2">{step.category}</span>
                )}
            </div>
            <small className="text-muted d-block">{step.description}</small>
        </div>
    );
};
