import React from "react";
import { useRemediationSteps } from "../hooks/useRemediationSteps";
import { RemediationStepItem } from "./RemediationStepItem";

interface Props {
    issueId: string;
}

export const RemediationStepsList: React.FC<Props> = ({ issueId }) => {
    const { steps, loading, error } = useRemediationSteps(issueId);

    if (loading) {
        return <div className="p-2 text-muted">Loading remediation steps...</div>;
    }

    if (error) {
        return <div className="alert alert-warning p-2 mb-0">{error}</div>;
    }

    if (!steps.length) {
        return <div className="p-2 text-muted">No remediation steps available.</div>;
    }

    return (
        <ol className="mb-0 ps-3">
            {steps.map((step) => (
                <li key={step.id} className="mb-2">
                    <RemediationStepItem step={step} />
                </li>
            ))}
        </ol>
    );
};
