import React from "react";
import { useDiagnosticInsights } from "../hooks/useDiagnosticInsights";
import { DiagnosticInsightItem } from "./DiagnosticInsightItem";

interface Props {
    caseId: string;
}

export const DiagnosticInsightsPanel: React.FC<Props> = ({ caseId }) => {
    const { insights, loading, error } = useDiagnosticInsights(caseId);

    if (loading) {
        return <div className="p-2 text-muted">Loading diagnostic insights...</div>;
    }

    if (error) {
        return <div className="alert alert-warning p-2 mb-0">{error}</div>;
    }

    if (!insights.length) {
        return <div className="p-2 text-muted">No diagnostic insights available.</div>;
    }

    return (
        <div className="border rounded p-2">
            <h6 className="fw-bold mb-2">Diagnostic Insights</h6>
            <ul className="list-unstyled mb-0">
                {insights.map((insight) => (
                    <li key={insight.id} className="mb-2">
                        <DiagnosticInsightItem insight={insight} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
