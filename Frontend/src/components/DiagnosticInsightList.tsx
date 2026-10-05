import React from "react";
import { DiagnosticInsightDto } from "../types/diagnosticInsight";

interface Props {
    insights: DiagnosticInsightDto[];
}

export const DiagnosticInsightList: React.FC<Props> = ({ insights }) => {
    if (!insights.length) {
        return <div className="text-muted">No diagnostic insights available.</div>;
    }

    return (
        <ul className="list-group">
            {insights.map((insight) => (
                <li key={insight.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{insight.rootCause}</span>
                    <span className="badge bg-primary">
                        {(insight.confidence * 100).toFixed(0)}%
                    </span>
                </li>
            ))}
        </ul>
    );
};
