import React from "react";
import { useParams } from "react-router-dom";
import { useRealTimeInsights } from "../hooks/useRealTimeInsights";
import { useRemediationInstructions } from "../hooks/useRemediationInstructions";
import { useContextAwareIssues } from "../hooks/useContextAwareIssues";
import { useMemberContextSummary } from "../hooks/useMemberContextSummary";
import { useRemediationWorkflow } from "../hooks/useRemediationWorkflow";
import { useInsightsWithConfidence } from "../hooks/useInsightsWithConfidence";
import { useInsightConfidenceDetails } from "../hooks/useInsightConfidenceDetails";
import { useDiagnosticInsights } from "../hooks/useDiagnosticInsights";
import { RealTimeInsightsHeader } from "./RealTimeInsightsHeader";
import { RealTimeInsightsList } from "./RealTimeInsightsList";
import { IssueSummaryHeader } from "./IssueSummaryHeader";
import { RemediationInstructionsPanel } from "./RemediationInstructionsPanel";
import { MemberContextSummaryPanel } from "./MemberContextSummaryPanel";
import { ContextAwareIssuesList } from "./ContextAwareIssuesList";
import { RemediationWorkflowPanel } from "./RemediationWorkflowPanel";
import { WorkflowProgressSummaryBar } from "./WorkflowProgressSummaryBar";
import { DiagnosticInsightsHeader } from "./DiagnosticInsightsHeader";
import { DiagnosticInsightsList } from "./DiagnosticInsightsList";
import { InsightsRefreshStatusBar } from "./InsightsRefreshStatusBar";
import { InsightConfidenceDetailsModal } from "./InsightConfidenceDetailsModal";

export const DiagnosticPanelPage: React.FC = () => {
    const params = useParams<{ caseId: string; issueId?: string }>();
    const caseId = params.caseId || "";
    const issueId = params.issueId || "issue-1";

    const { insights: realTimeInsights, isLoading: rtLoading, error: rtError, isStreaming, triggerAnalyze } = useRealTimeInsights(caseId);
    const { instructions, isLoading: instrLoading, error: instrError, refresh } = useRemediationInstructions(issueId);
    const { issues, isLoading: ctxLoading, error: ctxError, analyze } = useContextAwareIssues(caseId);
    const { summary, isLoading: summaryLoading } = useMemberContextSummary(caseId);
    const { workflow, isLoading: wfLoading, error: wfError, onUpdateStepStatus } = useRemediationWorkflow(caseId, issueId);
    const { insights: confidenceInsights, isLoading: confLoading, error: confError } = useInsightsWithConfidence(caseId);
    const [selectedInsightId, setSelectedInsightId] = React.useState<string | null>(null);
    const [isConfidenceDetailsOpen, setConfidenceDetailsOpen] = React.useState<boolean>(false);
    const { details, isLoading: detailsLoading, error: detailsError } = useInsightConfidenceDetails(selectedInsightId, isConfidenceDetailsOpen);
    const { insights: diagInsights, isLoading: diagLoading, error: diagError, refreshStatus, lastRefreshUtc, triggerManualRefresh } = useDiagnosticInsights(caseId);

    const onShowConfidenceDetails = (insightId: string) => {
        setSelectedInsightId(insightId);
        setConfidenceDetailsOpen(true);
    };

    return (
        <div className="container py-3">
            <h2 className="mb-3">Diagnostic Panel</h2>

            {rtError && <div className="alert alert-danger">{rtError}</div>}
            <RealTimeInsightsHeader isStreaming={isStreaming} />
            <button className="btn btn-primary mb-2" onClick={triggerAnalyze} disabled={rtLoading}>
                Analyze in real time
            </button>
            <RealTimeInsightsList insights={realTimeInsights} isLoading={rtLoading} />

            <IssueSummaryHeader issueId={issueId} />
            {instrError && <div className="alert alert-danger">{instrError}</div>}
            <RemediationInstructionsPanel issueId={issueId} instructions={instructions} isLoading={instrLoading} onRefresh={refresh} />

            <MemberContextSummaryPanel summary={summary} isLoading={summaryLoading} />
            {ctxError && <div className="alert alert-danger">{ctxError}</div>}
            <button className="btn btn-secondary mb-2" onClick={analyze} disabled={ctxLoading}>
                Analyze with context
            </button>
            <ContextAwareIssuesList issues={issues} isLoading={ctxLoading} />

            {wfError && <div className="alert alert-danger">{wfError}</div>}
            <RemediationWorkflowPanel caseId={caseId} issueId={issueId} workflow={workflow} isLoading={wfLoading} onUpdateStepStatus={onUpdateStepStatus} />
            <WorkflowProgressSummaryBar overallStatus={workflow?.overallStatus || ""} completedStepCount={workflow?.steps.filter(s => s.status === "Completed").length || 0} totalStepCount={workflow?.steps.length || 0} />

            {confError && <div className="alert alert-danger">{confError}</div>}
            <DiagnosticInsightsList insights={confidenceInsights} isLoading={confLoading} onShowConfidenceDetails={onShowConfidenceDetails} />

            <DiagnosticInsightsHeader />
            {diagError && <div className="alert alert-danger">{diagError}</div>}
            <button className="btn btn-outline-primary mb-2" onClick={triggerManualRefresh} disabled={diagLoading}>
                Manual refresh
            </button>
            <DiagnosticInsightsList insights={diagInsights} isLoading={diagLoading} />
            <InsightsRefreshStatusBar lastRefreshUtc={lastRefreshUtc} refreshInProgress={refreshStatus === "InProgress"} />

            <InsightConfidenceDetailsModal isOpen={isConfidenceDetailsOpen} onClose={() => setConfidenceDetailsOpen(false)} insightId={selectedInsightId} details={details} isLoading={detailsLoading} error={detailsError} />
        </div>
    );
};
