import React from "react";
import { RemediationStep } from "../types/remediation";
import { RemediationStepItem } from "./RemediationStepItem";

interface RemediationStepsSectionProps {
    steps: RemediationStep[];
    loading: boolean;
    error: string | null;
}

export const RemediationStepsSection: React.FC<RemediationStepsSectionProps> = ({
    steps,
    loading,
    error,
}) => {
    if (loading) {
        return <div className="text-muted">Loading remediation steps...</div>;
    }

    if (error) {
        return <div className="alert alert-warning p-2">{error}</div>;
    }

    if (!steps.length) {
        return <div className="text-muted">No remediation steps available.</div>;
    }

    return (
        <div>
            {steps.map((step) => (
                <RemediationStepItem key={step.id} step={step} onToggle={() => {}} />
            ))}
        </div>
    );
};
