import React from 'react';
import { Workflow } from '../types/workflow';

interface Props {
  workflow: Workflow;
}

export const WorkflowStepList: React.FC<Props> = ({ workflow }) => {
  const completedCount = workflow.steps.filter((s) => s.isCompleted).length;
  const progress = workflow.totalSteps ? Math.round((completedCount / workflow.totalSteps) * 100) : 0;

  return (
    <div>
      <div className="mb-2">Progress: {progress}%</div>
      <ul className="list-group">
        {workflow.steps.map((step, index) => (
          <li
            key={step.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              index === workflow.currentStepIndex ? 'fw-bold' : ''
            }`}
          >
            <div>
              <div>{step.title}</div>
              <div className="small text-muted">{step.description}</div>
            </div>
            {step.isCompleted && <span className="badge bg-success">Done</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
