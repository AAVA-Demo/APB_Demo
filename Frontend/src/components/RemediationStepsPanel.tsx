import React from "react";
import { RemediationStepsResponse } from "../types/remediation";
import { RemediationStepItem } from "./RemediationStepItem";

interface Props {
    data: RemediationStepsResponse | null;
    loading: boolean;
    error: string | null;
}

export const RemediationStepsPanel: React.FC<Props> = ({ data, loading, error }) => {
    if (loading) {
        return <div className="text-muted small">Loading remediation steps...</div>;
    }

    if (error) {
        return <div className="alert alert-secondary py-1 my-0">{error}</div>;
    }

    if (!data || data.steps.length === 0) {
        return <div className="text-muted small">No remediation steps available.</div>;
    }

    return (
        <div className="border rounded p-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
            <div className="fw-semibold mb-2">Remediation Steps</div>
            <ol className="mb-0 ps-3">
                {data.steps.map(step => (
                    <RemediationStepItem key={step.stepNumber} step={step} />
                ))}
            </ol>
        </div>
    );
};
