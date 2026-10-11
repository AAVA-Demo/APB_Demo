import React from "react";
import { RemediationStepDto } from "../types/remediationSteps";
import { RemediationStepItem } from "./RemediationStepItem";

interface Props {
  issuePatternId: string;
  steps: RemediationStepDto[];
  completed: number[];
  onToggleCompleted: (stepNumber: number) => void;
}

export const RemediationStepList: React.FC<Props> = ({
  issuePatternId,
  steps,
  completed,
  onToggleCompleted,
}) => {
  return (
    <div>
      <div className="mb-2"><strong>Pattern:</strong> {issuePatternId}</div>
      {steps.map((step) => (
        <RemediationStepItem
          key={step.stepNumber}
          step={step}
          completed={completed.includes(step.stepNumber)}
          onToggleCompleted={onToggleCompleted}
        />
      ))}
      {steps.length === 0 && <div className="text-muted">No steps.</div>}
    </div>
  );
};
