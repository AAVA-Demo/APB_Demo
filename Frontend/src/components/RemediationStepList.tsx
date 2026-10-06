import React from "react";
import { RemediationGuidanceDto } from "../types/remediation";
import { RemediationStepStatusListDto } from "../types/remediationStepTracking";
import { RemediationStepItem } from "./RemediationStepItem";

interface Props {
    guidance: RemediationGuidanceDto;
    statusList: RemediationStepStatusListDto;
    completeStep: (stepId: string) => void;
    updatingStepId: string | null;
}

export const RemediationStepList: React.FC<Props> = ({ guidance, statusList, completeStep, updatingStepId }) => {
    const statusById = new Map(statusList.steps.map((s) => [s.stepId, s]));

    return (
        <ul className="list-group">
            {statusList.steps.map((status) => {
                const guidanceStep = guidance.steps.find((s) => s.stepOrder === status.stepOrder);
                return (
                    <RemediationStepItem
                        key={status.stepId}
                        status={status}
                        guidanceStep={guidanceStep}
                        onToggle={() => completeStep(status.stepId)}
                        updating={updatingStepId === status.stepId}
                    />
                );
            })}
        </ul>
    );
};
