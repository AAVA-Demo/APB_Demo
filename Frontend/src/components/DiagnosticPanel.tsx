import React from "react";
import { useDiagnosticPanelData } from "../hooks/useDiagnosticPanelData";
import { useRealTimeInsights } from "../hooks/useRealTimeInsights";
import { useIssueContextSummary } from "../hooks/useIssueContextSummary";
import { useRemediationSteps } from "../hooks/useRemediationSteps";
import { DiagnosticPanelResponse } from "../types/diagnosticPanel";
import { RealTimeInsightList } from "./RealTimeInsightList";
import { IssueContextSummaryPanel } from "./IssueContextSummaryPanel";
import { InsightList } from "./InsightList";
import { RemediationStepsPanel } from "./RemediationStepsPanel";

interface DiagnosticPanelProps {
    caseId: string;
    memberId?: string;
    issueId: string;
    token?: string;
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({ caseId, memberId, issueId, token }) => {
    const { data, loading, error, refresh } = useDiagnosticPanelData(caseId, memberId, token);
    const rt = useRealTimeInsights(caseId, token);
    const ctx = useIssueContextSummary(caseId, token);
    const remediation = useRemediationSteps(caseId, issueId, token);

    const panel: DiagnosticPanelResponse | null = data;

    return (
        <div className="border rounded p-3 d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <div className="fw-bold">Diagnostic Panel</div>
                    <div className="text-muted small">Case: {caseId} {memberId && `· Member: ${memberId}`}</div>
                </div>
                <button className="btn btn-sm btn-outline-primary" onClick={refresh}>Refresh</button>
            </div>

            {loading && <div className="text-center text-muted">Loading panel...</div>}
            {error && <div className="alert alert-warning py-1 my-0">{error}</div>}

            {panel && (
                <>
                    <IssueContextSummaryPanel response={ctx.data} loading={ctx.loading} error={ctx.error} />
                    <InsightList insights={panel.insights} />
                    <RealTimeInsightList data={rt.data} loading={rt.loading} error={rt.error} />
                    <RemediationStepsPanel data={remediation.data} loading={remediation.loading} error={remediation.error} />
                </>
            )}
        </div>
    );
};
