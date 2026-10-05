import React from 'react';
import { RemediationStep } from '../types/remediation';

interface Props {
  step: RemediationStep;
  index: number;
}

export const RemediationStepItem: React.FC<Props> = ({ step, index }) => {
  return (
    <li className="mb-2">
      <div className="fw-bold">Step {index + 1}: {step.title}</div>
      <div className="small text-muted">{step.description}</div>
    </li>
  );
};
