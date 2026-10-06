import React from 'react';
import { RemediationStepListProps } from '../types/remediationGuidance';
import { RemediationStepItem } from './RemediationStepItem';

export const RemediationStepList: React.FC<RemediationStepListProps> = ({ steps }) => {
    if (!steps || steps.length === 0) {
        return <div className="text-muted">No remediation steps available.</div>;
    }

    return (
        <ol className="list-group list-group-numbered mb-2">
            {steps.map(step => (
                <RemediationStepItem
                    key={step.stepNumber}
                    stepNumber={step.stepNumber}
                    title={step.title}
                    instruction={step.instruction}
                />
            ))}
        </ol>
    );
};
