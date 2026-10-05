import React from "react";
import { RemediationStepViewModel } from "../types/remediationStepTracking";

interface Props {
  steps: RemediationStepViewModel[];
  onCompleteStep: (stepId: string) => void;
  nextStepId: string | null;
}

export const RemediationStepList: React.FC<Props> = ({
  steps,
  onCompleteStep,
  nextStepId,
}) => {
  return (
    <ul className="list-group">
      {steps.map((step) => (
        <li
          key={step.stepId}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <span
              className={
                step.completed
                  ? "text-decoration-line-through text-muted"
                  : ""
              }
            >
              {step.description}
            </span>
            {nextStepId === step.stepId && !step.completed && (
              <span className="badge bg-info ms-2">Next</span>
            )}
          </div>
          {!step.completed && (
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => onCompleteStep(step.stepId)}
            >
              Complete
            </button>
          )}
          {step.completed && (
            <span className="badge bg-success">Completed</span>
          )}
        </li>
      ))}
    </ul>
  );
};
