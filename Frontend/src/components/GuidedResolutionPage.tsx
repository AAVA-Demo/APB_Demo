import React from "react";
import { useGuidedResolutionWorkflow } from "../hooks/useGuidedResolutionWorkflow";
import { GuidedResolutionStepsList } from "./GuidedResolutionStepsList";

interface Props {
    issueId: string;
}

export const GuidedResolutionPage: React.FC<Props> = ({ issueId }) => {
    const { workflow, loading, error, updateStepStatus } = useGuidedResolutionWorkflow(issueId);

    if (loading) {
        return <div className="p-3 text-muted">Loading guided workflow...</div>;
    }

    if (error) {
        return <div className="alert alert-warning p-3 mb-0">{error}</div>;
    }

    if (!workflow) {
        return <div className="p-3 text-muted">No guided workflow available.</div>;
    }

    return (
        <div className="container p-3">
            <h5 className="mb-3">Guided Resolution Workflow</h5>
            <GuidedResolutionStepsList workflow={workflow} onUpdateStepStatus={updateStepStatus} />
        </div>
    );
};
