import React from "react";
import { RemediationStepViewModel } from "../types/diagnosticInsights";

interface Props {
    steps: RemediationStepViewModel[];
}

export const RemediationStepsList: React.FC<Props> = ({ steps }) => {
    if (!steps || steps.length === 0) {
        return <div className="text-muted mt-2">No remediation steps.</div>;
    }

    return (
        <ul className="list-group mt-2">
            {steps.map(step => (
                <li key={step.stepId} className="list-group-item">
                    <span className="fw-bold me-2">Step {step.order}</span>
                    <span>{step.text}</span>
                </li>
            ))}
        </ul>
    );
};
