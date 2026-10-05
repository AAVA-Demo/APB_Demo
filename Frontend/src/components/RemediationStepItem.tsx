import React from "react";
import { RemediationStep } from "../types/remediation";

interface RemediationStepItemProps {
    step: RemediationStep;
    onToggle: () => void;
}

export const RemediationStepItem: React.FC<RemediationStepItemProps> = ({
    step,
    onToggle,
}) => {
    return (
        <div className="d-flex align-items-center mb-2">
            <input
                type="checkbox"
                className="form-check-input me-2"
                checked={step.isCompleted}
                onChange={onToggle}
            />
            <div>
                <div>
                    <strong className="me-2">Step {step.order}</strong>
                    {step.description}
                </div>
            </div>
        </div>
    );
};
