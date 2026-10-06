import React from 'react';
import { RemediationStepItemProps } from '../types/remediationGuidance';

export const RemediationStepItem: React.FC<RemediationStepItemProps> = ({ stepNumber, title, instruction }) => {
    return (
        <li className="list-group-item">
            <div className="d-flex justify-content-between">
                <span className="fw-bold">Step {stepNumber}: {title}</span>
            </div>
            <p className="mb-0">{instruction}</p>
        </li>
    );
};
