import React from "react";
import { RemediationInstructionViewModel } from "../types/remediationInstructions";

interface Props {
    instruction: RemediationInstructionViewModel;
}

export const RemediationInstructionItem: React.FC<Props> = ({ instruction }) => {
    return (
        <li className="list-group-item d-flex flex-column">
            <div className="fw-bold">{instruction.title}</div>
            <div>{instruction.description}</div>
        </li>
    );
};
