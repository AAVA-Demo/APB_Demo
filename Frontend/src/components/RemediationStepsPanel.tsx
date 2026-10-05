import React from 'react';
import { useRemediationSteps } from '../hooks/useRemediationSteps';
import { RemediationStepItem } from './RemediationStepItem';

interface RemediationStepsPanelProps {
    insightId: string;
}

export const RemediationStepsPanel: React.FC<RemediationStepsPanelProps> = ({ insightId }) => {
    const { steps, loading, error } = useRemediationSteps(insightId);

    return (
        <div className="mt-3">
            <h4 className="mb-2">Remediation Steps</h4>
            {error && (
                <div className="alert alert-danger" role="alert">
                    Failed to load remediation steps: {error}
                </div>
            )}
            {loading && (
                <div className="text-center my-2">
                    <div className="spinner-border" role="status" />
                </div>
            )}
            {!loading && steps.length === 0 && !error && (
                <div className="alert alert-info" role="alert">
                    No remediation steps available for this insight.
                </div>
            )}
            {!loading && steps.length > 0 && (
                <ol className="ps-3">
                    {steps.map((step) => (
                        <RemediationStepItem key={step.id} step={step} />
                    ))}
                </ol>
            )}
        </div>
    );
};
