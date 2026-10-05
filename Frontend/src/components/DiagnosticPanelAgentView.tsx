import React from "react";
import { useAgentInsights } from "../hooks/useAgentInsights";
import { AgentInsightSummaryList } from "./AgentInsightSummaryList";
import { AgentRemediationStepsList } from "./AgentRemediationStepsList";

interface Props {
    interactionId: string;
    memberId: string;
}

export const DiagnosticPanelAgentView: React.FC<Props> = ({ interactionId, memberId }) => {
    const { data, loading, error } = useAgentInsights(interactionId);

    if (loading) {
        return <div className="p-3">Loading agent guidance...</div>;
    }

    if (error) {
        return <div className="alert alert-danger p-2">{error}</div>;
    }

    if (!data) {
        return <div className="text-muted p-2">No agent guidance available.</div>;
    }

    return (
        <div className="p-3">
            <div className="mb-3">
                <h5 className="mb-1">Agent Guidance</h5>
                <div className="text-muted small">Member: {memberId}</div>
                {data.issueContext && <p className="mb-0 mt-2">{data.issueContext}</p>}
            </div>
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <AgentInsightSummaryList insights={data.diagnosticInsights} />
                </div>
                <div className="col-12 col-md-6">
                    <AgentRemediationStepsList steps={data.remediationSteps} />
                </div>
            </div>
        </div>
    );
};
