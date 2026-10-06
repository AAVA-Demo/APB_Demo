import React from "react";
import { useRemediationGuidance } from "../hooks/useRemediationGuidance";
import { useRemediationStepTracking } from "../hooks/useRemediationStepTracking";
import { RemediationStepList } from "./RemediationStepList";

interface Props {
    caseId: string;
    issueId: string;
}

export const RemediationSection: React.FC<Props> = ({ caseId, issueId }) => {
    const guidance = useRemediationGuidance(caseId, issueId);
    const tracking = useRemediationStepTracking(caseId, issueId, "agent-1");

    if (!issueId) {
        return (
            <div className="card">
                <div className="card-header">Remediation Guidance</div>
                <div className="card-body">
                    <p className="text-muted mb-0">Select an issue to view remediation steps.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">Remediation Guidance for Issue {issueId}</div>
            <div className="card-body">
                {(guidance.loading || tracking.loading) && (
                    <div className="text-center mb-2"><div className="spinner-border" /></div>
                )}
                {(guidance.error || tracking.error) && (
                    <div className="alert alert-danger mb-2">{guidance.error || tracking.error}</div>
                )}
                {!guidance.loading && !tracking.loading && guidance.data && tracking.data && (
                    <RemediationStepList
                        guidance={guidance.data}
                        statusList={tracking.data}
                        completeStep={tracking.completeStep}
                        updatingStepId={tracking.updatingStepId}
                    />
                )}
                {!guidance.loading && !guidance.error && guidance.data && guidance.data.steps.length === 0 && (
                    <p className="text-muted mb-0">No remediation steps available.</p>
                )}
            </div>
        </div>
    );
};
