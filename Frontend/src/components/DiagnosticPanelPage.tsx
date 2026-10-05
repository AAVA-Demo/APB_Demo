import React from "react";
import { useDiagnosticInsights } from "../hooks/useDiagnosticInsights";
import { useRemediationSteps } from "../hooks/useRemediationSteps";
import { useRecommendations } from "../hooks/useRecommendations";
import { useMemberIssueSummary } from "../hooks/useMemberIssueSummary";
import { useInsights } from "../hooks/useInsights";
import { DiagnosticInsightsList } from "./DiagnosticInsightsList";
import { RemediationStepsSection } from "./RemediationStepsSection";
import { RecommendationsPanel } from "./RecommendationsPanel";
import { MemberIssueSummaryHeader } from "./MemberIssueSummaryHeader";
import { RemediationPanel } from "./RemediationPanel";
import { InsightsList } from "./InsightsList";
import { RefreshInsightsButton } from "./RefreshInsightsButton";

interface DiagnosticPanelPageProps {
    memberId: string;
}

export const DiagnosticPanelPage: React.FC<DiagnosticPanelPageProps> = ({ memberId }) => {
    const diagnostic = useDiagnosticInsights(memberId);
    const remediation = useRemediationSteps(memberId);
    const recommendations = useRecommendations(memberId);
    const summary = useMemberIssueSummary(memberId);
    const insights = useInsights(memberId);

    return (
        <div className="container mt-3">
            <MemberIssueSummaryHeader
                summary={summary.summary}
                loading={summary.loading}
                error={summary.error}
            />

            <div className="row mt-3">
                <div className="col-md-6 mb-3">
                    <h5>Diagnostic Insights</h5>
                    <DiagnosticInsightsList
                        insights={diagnostic.insights}
                        loading={diagnostic.loading}
                        error={diagnostic.error}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <h5>Remediation Steps</h5>
                    <RemediationPanel
                        steps={remediation.steps}
                        loading={remediation.loading}
                        error={remediation.error}
                        completionPercentage={remediation.completionPercentage}
                        onToggleStep={remediation.toggleStepCompleted}
                    />
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-6 mb-3">
                    <h5>Prioritized Recommendations</h5>
                    <RecommendationsPanel
                        recommendations={recommendations.recommendations}
                        loading={recommendations.loading}
                        error={recommendations.error}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">Refreshed Insights</h5>
                        <RefreshInsightsButton
                            onClick={insights.refreshInsights}
                            loading={insights.loading}
                        />
                    </div>
                    <InsightsList
                        insights={insights.insights}
                        loading={insights.loading}
                        error={insights.error}
                    />
                </div>
            </div>
        </div>
    );
};
