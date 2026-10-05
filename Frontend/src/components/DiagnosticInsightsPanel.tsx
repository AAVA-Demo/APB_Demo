import React from "react";
import { useDiagnosticInsights } from "../hooks/useDiagnosticInsights";
import { DiagnosticInsightList } from "./DiagnosticInsightList";

interface Props {
    interactionId: string;
}

export const DiagnosticInsightsPanel: React.FC<Props> = ({ interactionId }) => {
    const { data, loading, error } = useDiagnosticInsights(interactionId);

    if (loading) {
        return <div className="d-flex justify-content-center p-3">Loading diagnostic insights...</div>;
    }

    if (error) {
        return <div className="alert alert-danger p-2">{error}</div>;
    }

    if (!data) {
        return <div className="text-muted p-2">No diagnostic insights available.</div>;
    }

    return (
        <div className="p-3">
            <h5 className="mb-3">Diagnostic Insights</h5>
            <DiagnosticInsightList insights={data.insights} />
        </div>
    );
};
