import React from "react";
import { DiagnosticInsightsPanel } from "./DiagnosticInsightsPanel";
import { RemediationInstructionsPanel } from "./RemediationInstructionsPanel";
import { RootCauseRecommendationsPanel } from "./RootCauseRecommendationsPanel";
import { ContextAwareInsightsPanel } from "./ContextAwareInsightsPanel";
import { CaseResolutionMetricsSummary } from "./CaseResolutionMetricsSummary";
import { CaseResolutionMetricsRecorder } from "./CaseResolutionMetricsRecorder";

interface DiagnosticPanelPageProps {
    caseId: string;
    memberId: string;
}

export const DiagnosticPanelPage: React.FC<DiagnosticPanelPageProps> = ({ caseId, memberId }) => {
    const handleMetricsRecorded = () => {};

    return (
        <div className="container-fluid p-3">
            <div className="row mb-3">
                <div className="col-12 col-lg-6 mb-3">
                    <DiagnosticInsightsPanel caseId={caseId} />
                </div>
                <div className="col-12 col-lg-6 mb-3">
                    <ContextAwareInsightsPanel memberId={memberId} caseId={caseId} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-12 col-lg-6 mb-3">
                    <RemediationInstructionsPanel caseId={caseId} />
                </div>
                <div className="col-12 col-lg-6 mb-3">
                    <RootCauseRecommendationsPanel caseId={caseId} />
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-lg-6 mb-3">
                    <CaseResolutionMetricsSummary caseId={caseId} />
                </div>
                <div className="col-12 col-lg-6 mb-3">
                    <CaseResolutionMetricsRecorder
                        caseId={caseId}
                        handleTimeSeconds={120}
                        stepsFollowed={3}
                        aiGuidanceUsed={true}
                        onMetricsRecorded={handleMetricsRecorded}
                    />
                </div>
            </div>
        </div>
    );
};
