import React from "react";
import { RemediationInstructionViewModel } from "../types/remediationInstructions";
import { RemediationInstructionList } from "./RemediationInstructionList";

interface Props {
    issueId: string;
    instructions: RemediationInstructionViewModel[];
    isLoading: boolean;
    onRefresh: () => void;
}

export const RemediationInstructionsPanel: React.FC<Props> = ({ issueId, instructions, isLoading, onRefresh }) => {
    return (
        <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">Remediation Instructions</h4>
                <button className="btn btn-sm btn-outline-secondary" onClick={onRefresh} disabled={isLoading}>
                    Refresh instructions
                </button>
            </div>
            {isLoading && <div className="text-muted">Loading instructions...</div>}
            {!isLoading && (
                <RemediationInstructionList instructions={instructions} />
            )}
        </div>
    );
};
