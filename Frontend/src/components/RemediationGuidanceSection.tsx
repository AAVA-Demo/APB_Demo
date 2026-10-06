import React from 'react';
import { RemediationGuidanceSectionProps } from '../types/remediationGuidance';
import { useRemediationGuidance } from '../hooks/useRemediationGuidance';
import { RemediationStepList } from './RemediationStepList';

export const RemediationGuidanceSection: React.FC<RemediationGuidanceSectionProps> = ({ memberIssueId }) => {
    const { guidance, loading, error } = useRemediationGuidance(memberIssueId);

    if (loading) {
        return <div className="p-3 border rounded bg-light">Loading remediation guidance...</div>;
    }

    if (error) {
        return <div className="p-3 border rounded bg-light text-danger">{error}</div>;
    }

    if (!guidance) {
        return <div className="p-3 border rounded bg-light">Remediation guidance is not available for this issue.</div>;
    }

    return (
        <section className="p-3 border rounded bg-white mb-3">
            <h5 className="mb-2">Remediation Instructions</h5>
            <p className="mb-2"><strong>Issue:</strong> {guidance.issueSummary}</p>
            <RemediationStepList steps={guidance.steps} />
        </section>
    );
};
