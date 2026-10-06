import React from "react";
import { RemediationStepDto } from "../types/remediation";
import { RemediationStepStatusDto } from "../types/remediationStepTracking";

interface Props {
    status: RemediationStepStatusDto;
    guidanceStep?: RemediationStepDto;
    onToggle: () => void;
    updating: boolean;
}

export const RemediationStepItem: React.FC<Props> = ({ status, guidanceStep, onToggle, updating }) => {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={status.isCompleted}
                    onChange={onToggle}
                    disabled={updating}
                />
                <label className="form-check-label ms-2">
                    <span className="fw-semibold">Step {status.stepOrder}: {guidanceStep?.title || status.title}</span>
                    <div className="small text-muted">
                        {guidanceStep?.description || "No description."}
                    </div>
                </label>
            </div>
            <div className="text-end small">
                {updating && <span className="text-muted d-block mb-1">Updating...</span>}
                {status.isCompleted && (
                    <span className="badge bg-success">Completed</span>
                )}
            </div>
        </li>
    );
};
