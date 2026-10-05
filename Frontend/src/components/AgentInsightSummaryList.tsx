import React from "react";
import { AgentDiagnosticInsightDto } from "../types/agentInsight";

interface Props {
    insights: AgentDiagnosticInsightDto[];
}

export const AgentInsightSummaryList: React.FC<Props> = ({ insights }) => {
    if (!insights.length) {
        return <div className="text-muted">No insights available.</div>;
    }

    return (
        <ul className="list-group">
            {insights.map((insight) => (
                <li key={insight.id} className="list-group-item">
                    <div className="fw-semibold">{insight.title}</div>
                    <div className="small text-muted">{insight.description}</div>
                </li>
            ))}
        </ul>
    );
};
