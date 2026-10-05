import React from "react";
import { RemediationStepDto } from "../types/remediation";

interface Props {
    steps: RemediationStepDto[];
}

export const RemediationStepList: React.FC<Props> = ({ steps }) => {
    if (!steps.length) {
        return <div className="text-muted">No remediation steps available.</div>;
    }

    return (
        <ol className="list-group list-group-numbered">
            {steps.map((step) => (
                <li key={step.stepNumber} className="list-group-item">
                    {step.instruction}
                </li>
            ))}
        </ol>
    );
};
