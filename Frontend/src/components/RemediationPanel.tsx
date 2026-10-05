import React from "react";
import { RemediationStep } from "../types/remediation";
import { RemediationStepItem } from "./RemediationStepItem";
import { ProgressBar } from "./ProgressBar";

interface RemediationPanelProps {
    steps: RemediationStep[];
    loading: boolean;
    error: string | null;
    completionPercentage: number;
    onToggleStep: (stepId: string) => void;
}

export const RemediationPanel: React.FC<RemediationPanelProps> = ({
    steps,
    loading,
    error,
    completionPercentage,
    onToggleStep,
}) => {
    if (loading) {
        return <div className="text-muted">Loading remediation steps...</div>;
    }

    if (error) {
        return <div className="alert alert-warning p-2">{error}</div>;
    }

    return (
        <div>
            <ProgressBar completionPercentage={completionPercentage} />
            {steps.length === 0 && (
                <div className="text-muted mt-2">No remediation steps available.</div>
            )}
            {steps.map((step) => (
                <RemediationStepItem
                    key={step.id}
                    step={step}
                    onToggle={() => onToggleStep(step.id)}
                />
            ))}
        </div>
    );
};
