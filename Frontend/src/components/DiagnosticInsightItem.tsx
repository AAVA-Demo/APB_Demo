import React from "react";
import { InsightViewModel } from "../types/diagnosticInsights";
import { RemediationStepsList } from "./RemediationStepsList";
import { InsightConfidenceIndicator } from "./InsightConfidenceIndicator";

interface Props {
    insight: InsightViewModel;
    onShowConfidenceDetails?: (insightId: string) => void;
}

export const DiagnosticInsightItem: React.FC<Props> = ({ insight, onShowConfidenceDetails }) => {
    const onClick = () => {
        if (onShowConfidenceDetails) {
            onShowConfidenceDetails(insight.insightId);
        }
    };

    return (
        <div className="list-group-item mb-1">
            <div className="d-flex justify-content-between">
                <div>
                    <h5 className="mb-1">{insight.title}</h5>
                    <p className="mb-1">{insight.description}</p>
                </div>
                <InsightConfidenceIndicator confidenceScore={insight.confidence} confidenceLevel={""} confidenceLabel={""} onClick={onClick} />
            </div>
            <small className="text-muted">Last updated: {insight.lastUpdatedUtc}</small>
            <RemediationStepsList steps={insight.remediationSteps} />
        </div>
    );
};
