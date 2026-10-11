import React from "react";
import { RemediationStepDto } from "../types/remediationSteps";

interface Props {
  step: RemediationStepDto;
  completed: boolean;
  onToggleCompleted: (stepNumber: number) => void;
}

export const RemediationStepItem: React.FC<Props> = ({ step, completed, onToggleCompleted }) => {
  return (
    <div
      className={`d-flex align-items-start mb-2 p-2 border rounded ${completed ? "bg-light" : ""}`}
      onClick={() => onToggleCompleted(step.stepNumber)}
    >
      <div className="me-2 fw-bold">{step.stepNumber}.</div>
      <div className="flex-grow-1">
        <div className="fw-bold">{step.title}</div>
        <div className="small">{step.description}</div>
      </div>
      {completed && <span className="badge bg-success ms-2">Done</span>}
    </div>
  );
};
