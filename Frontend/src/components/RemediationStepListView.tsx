import React from "react";
import { RemediationStepViewModel } from "../types/remediationStep";

interface Props {
  steps: RemediationStepViewModel[];
}

export const RemediationStepListView: React.FC<Props> = ({ steps }) => {
  return (
    <ol className="list-group list-group-numbered">
      {steps.map((step) => (
        <li
          key={step.stepId}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span>{step.description}</span>
        </li>
      ))}
    </ol>
  );
};
