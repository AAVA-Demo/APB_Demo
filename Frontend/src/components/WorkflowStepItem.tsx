import React from 'react';
import { WorkflowStep } from '../types/Workflow';

interface WorkflowStepItemProps {
    step: WorkflowStep;
    onToggle: () => void;
}

export const WorkflowStepItem: React.FC<WorkflowStepItemProps> = ({ step, onToggle }) => {
    return (
        <li className="mb-2 d-flex align-items-start">
            <div className="form-check me-2 mt-1">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={step.isCompleted}
                    onChange={onToggle}
                />
            </div>
            <div>
                <div className="fw-bold">{step.title}</div>
                <div>{step.instruction}</div>
            </div>
        </li>
    );
};
