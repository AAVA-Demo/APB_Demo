import React from "react";
import { useRemediationSteps } from "../hooks/useRemediationSteps";
import { RemediationStepList } from "./RemediationStepList";

interface Props {
    caseId: string;
}

export const RemediationStepsPanel: React.FC<Props> = ({ caseId }) => {
    const { data, loading, error } = useRemediationSteps(caseId);

    if (loading) {
        return <div className="d-flex justify-content-center p-3">Loading remediation steps...</div>;
    }

    if (error) {
        return <div className="alert alert-danger p-2">{error}</div>;
    }

    if (!data) {
        return <div className="text-muted p-2">No remediation steps available.</div>;
    }

    return (
        <div className="p-3">
            <h5 className="mb-3">Steps to resolve</h5>
            <RemediationStepList steps={data.steps} />
        </div>
    );
};
