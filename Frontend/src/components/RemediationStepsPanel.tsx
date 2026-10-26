import React from "react";
import { useRemediationSteps } from "../hooks/useRemediationSteps";

export interface RemediationStepsPanelProps {
    caseId: string;
    insightId: string;
}

export const RemediationStepsPanel: React.FC<RemediationStepsPanelProps> = ({ caseId, insightId }) => {
    const { data, loading, error, reload } = useRemediationSteps(caseId, insightId);

    return (
        <div className="p-3 border rounded mt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Remediation Steps</h6>
                <button className="btn btn-sm btn-outline-secondary" onClick={reload}>
                    Refresh
                </button>
            </div>
            {loading && <div className="text-center py-2">Loading steps...</div>}
            {error && (
                <div className="alert alert-warning d-flex justify-content-between align-items-center">
                    <span>Unable to load remediation steps</span>
                    <button className="btn btn-sm btn-light" onClick={reload}>
                        Retry
                    </button>
                </div>
            )}
            {!loading && !error && data && data.steps.length === 0 && (
                <div className="text-muted">No remediation steps defined.</div>
            )}
            {!loading && !error && data && data.steps.length > 0 && (
                <ol className="mb-0">
                    {data.steps
                        .slice()
                        .sort((a, b) => a.stepOrder - b.stepOrder)
                        .map(step => (
                            <li key={step.stepOrder} className="mb-1">
                                {step.description}
                            </li>
                        ))}
                </ol>
            )}
        </div>
    );
};
