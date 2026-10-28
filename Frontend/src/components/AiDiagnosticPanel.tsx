import React from "react";
import { useAiDiagnosticPanel } from "../hooks/useAiDiagnosticPanel";
import { DiagnosticInsightsList } from "./DiagnosticInsightsList";
import { RecommendationsList } from "./RecommendationsList";
import { AiInsightsList } from "./AiInsightsList";
import { GuidedActionsList } from "./GuidedActionsList";
import { GuidedActionDto } from "../types/guidedActions";
import { logGuidedActionExecution } from "../api/guidedActionLogApi";

export interface AiDiagnosticPanelProps {
  interactionId: string;
  agentId?: string;
}

export const AiDiagnosticPanel: React.FC<AiDiagnosticPanelProps> = ({ interactionId, agentId = "agent-1" }) => {
  const { diagnosticInsights, recommendations, aiInsights, loading, error, reload } = useAiDiagnosticPanel(interactionId);

  const handleActionExecuted = async (action: GuidedActionDto) => {
    const request = {
      interactionId,
      agentId,
      actionId: action.actionId,
      actionName: action.actionName,
      executedAt: new Date().toISOString(),
      additionalContext: action.additionalContext || "",
    };
    await logGuidedActionExecution(interactionId, request);
  };

  const guidedActions: GuidedActionDto[] = (recommendations?.recommendations || []).map(r => ({
    actionId: r.recommendationId,
    actionName: r.title,
    additionalContext: r.contextSummary,
  }));

  return (
    <div className="d-flex flex-column gap-3">
      {loading && <div>Loading AI diagnostics...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {diagnosticInsights && (
        <div>
          <h6>Diagnostic Insights</h6>
          <DiagnosticInsightsList insights={diagnosticInsights.insights} />
        </div>
      )}

      {recommendations && (
        <div>
          <h6>Recommendations</h6>
          <RecommendationsList recommendations={recommendations.recommendations} />
        </div>
      )}

      {aiInsights && (
        <div>
          <h6>AI Insights with Confidence</h6>
          <AiInsightsList insights={aiInsights.insights} />
        </div>
      )}

      <div>
        <h6>Guided Actions</h6>
        <GuidedActionsList actions={guidedActions} onActionExecuted={handleActionExecuted} />
      </div>

      <button className="btn btn-outline-secondary btn-sm" onClick={reload}>Refresh Panel</button>
    </div>
  );
};
