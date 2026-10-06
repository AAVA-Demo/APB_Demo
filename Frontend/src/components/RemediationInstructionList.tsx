import React from "react";
import { RemediationInstructionViewModel } from "../types/remediationInstructions";
import { RemediationInstructionItem } from "./RemediationInstructionItem";

interface Props {
    instructions: RemediationInstructionViewModel[];
}

export const RemediationInstructionList: React.FC<Props> = ({ instructions }) => {
    if (instructions.length === 0) {
        return <div className="text-muted">No remediation instructions available.</div>;
    }

    return (
        <ol className="list-group list-group-numbered">
            {instructions.map(i => (
                <RemediationInstructionItem key={i.instructionId} instruction={i} />
            ))}
        </ol>
    );
};
