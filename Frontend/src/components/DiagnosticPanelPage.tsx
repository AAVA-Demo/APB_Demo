import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDiagnosticInsights } from "../hooks/useDiagnosticInsights";
import { useContextAwareRecommendations } from "../hooks/useContextAwareRecommendations";
import { useCaseIssuesWithSeverity } from "../hooks/useCaseIssuesWithSeverity";
import { DiagnosticPanel } from "./DiagnosticPanel";
import { RecommendationSection } from "./RecommendationSection";
import { IssueListSection } from "./IssueListSection";
import { RealTimeInsightPanel } from "./RealTimeInsightPanel";
import { RemediationSection } from "./RemediationSection";

interface RouteParams {
    caseId: string;
}

export const DiagnosticPanelPage: React.FC = () => {
    const { caseId } = useParams<RouteParams>();
    const [selectedIssueId, setSelectedIssueId] = useState<string>("");

    const diagnostics = useDiagnosticInsights(caseId || "");
    const issues = useCaseIssuesWithSeverity(caseId || "");
    const recommendations = useContextAwareRecommendations(caseId || "");

    return (
        <div className="container py-3">
            <div className="mb-3">
                <h2 className="h4">Case Diagnostics Panel</h2>
                <p className="text-muted">Case ID: {caseId}</p>
            </div>

            <div className="mb-3">
                <button className="btn btn-sm btn-primary me-2" onClick={diagnostics.refresh}>
                    Refresh Diagnostics
                </button>
                <button className="btn btn-sm btn-secondary" onClick={recommendations.refresh}>
                    Refresh Recommendations
                </button>
            </div>

            <div className="row g-3">
                <div className="col-12 col-lg-6">
                    <DiagnosticPanel
                        data={diagnostics.data}
                        loading={diagnostics.loading}
                        error={diagnostics.error}
                    />
                    <RealTimeInsightPanel caseId={caseId || ""} />
                </div>
                <div className="col-12 col-lg-6">
                    <IssueListSection
                        data={issues.data}
                        loading={issues.loading}
                        error={issues.error}
                        onSelectIssue={setSelectedIssueId}
                        selectedIssueId={selectedIssueId}
                    />
                    <RecommendationSection
                        data={recommendations.data}
                        loading={recommendations.loading}
                        error={recommendations.error}
                    />
                </div>
            </div>

            <div className="mt-4">
                <RemediationSection caseId={caseId || ""} issueId={selectedIssueId} />
            </div>
        </div>
    );
};
