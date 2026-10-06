import React from "react";
import { InsightViewModel } from "../types/diagnosticInsights";
import { DiagnosticInsightItem } from "./DiagnosticInsightItem";

interface Props {
    insights: InsightViewModel[];
    isLoading: boolean;
    onShowConfidenceDetails?: (insightId: string) => void;
}

export const DiagnosticInsightsList: React.FC<Props> = ({ insights, isLoading, onShowConfidenceDetails }) => {
    if (isLoading) {
        return <div className="text-muted">Loading diagnostic insights...</div>;
    }

    if (insights.length === 0) {
        return <div className="text-muted">No diagnostic insights available.</div>;
    }

    return (
        <div className="list-group mb-3">
            {insights.map(insight => (
                <DiagnosticInsightItem key={insight.insightId} insight={insight} onShowConfidenceDetails={onShowConfidenceDetails} />
            ))}
        </div>
    );
};
