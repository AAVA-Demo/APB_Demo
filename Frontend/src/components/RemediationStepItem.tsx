import React, { useState } from "react";
import { RemediationStepDto } from "../types/remediation";

interface Props {
    step: RemediationStepDto;
}

export const RemediationStepItem: React.FC<Props> = ({ step }) => {
    const [completed, setCompleted] = useState<boolean>(false);

    return (
        <li className="mb-1 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between">
                <div className={completed ? "text-decoration-line-through" : ""}>
                    <span className="fw-semibold me-1">{step.title}</span>
                </div>
                <div className="form-check ms-2">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={completed}
                        onChange={() => setCompleted(!completed)}
                    />
                </div>
            </div>
            <div className={"small " + (completed ? "text-decoration-line-through" : "")}>{step.description}</div>
        </li>
    );
};
