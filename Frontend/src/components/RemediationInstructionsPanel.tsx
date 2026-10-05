import React, { useState } from "react";
import { useRemediationInstructions } from "../hooks/useRemediationInstructions";

interface RemediationInstructionsPanelProps {
    caseId: string;
}

export const RemediationInstructionsPanel: React.FC<RemediationInstructionsPanelProps> = ({ caseId }) => {
    const { data, loading, error } = useRemediationInstructions(caseId);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const toggleCompleted = (stepNumber: number) => {
        setCompletedSteps(prev =>
            prev.includes(stepNumber) ? prev.filter(s => s !== stepNumber) : [...prev, stepNumber]
        );
    };

    if (loading) {
        return <div className="p-3">Loading remediation instructions...</div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
            </div>
        );
    }

    if (!data || data.steps.length === 0) {
        return (
            <div className="p-3 border rounded">
                <h5 className="mb-2">Remediation Instructions</h5>
                <p className="mb-0 text-muted">No remediation steps available.</p>
            </div>
        );
    }

    return (
        <div className="p-3 border rounded">
            <h5 className="mb-3">Remediation Instructions</h5>
            <ol className="mb-0">
                {data.steps.map(step => (
                    <li key={step.stepNumber} className="mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{step.title}</strong>
                                <p className="mb-1 small">{step.description}</p>
                            </div>
                            <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => toggleCompleted(step.stepNumber)}
                            >
                                {completedSteps.includes(step.stepNumber) ? "Completed" : "Mark complete"}
                            </button>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};
