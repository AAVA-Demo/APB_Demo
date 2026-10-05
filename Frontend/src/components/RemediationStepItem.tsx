import React from 'react';
import { RemediationStep } from '../types/RemediationStep';

interface RemediationStepItemProps {
    step: RemediationStep;
}

export const RemediationStepItem: React.FC<RemediationStepItemProps> = ({ step }) => {
    return (
        <li className="mb-2">
            <div className="fw-bold">{step.title}</div>
            <div>{step.description}</div>
        </li>
    );
};
