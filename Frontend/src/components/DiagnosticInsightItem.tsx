import React, { useState } from "react";
import { DiagnosticInsight } from "../types/diagnosticInsights";

export interface DiagnosticInsightItemProps {
  insight: DiagnosticInsight;
}

export const DiagnosticInsightItem: React.FC<DiagnosticInsightItemProps> = ({ insight }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <button type="button" className="list-group-item list-group-item-action" onClick={() => setExpanded(!expanded)}>
      <div className="d-flex justify-content-between">
        <span>{insight.summary}</span>
        <span className="text-muted small">{insight.insightId}</span>
      </div>
      {expanded && (
        <div className="mt-2 text-muted small">Probable cause: {insight.probableCause}</div>
      )}
    </button>
  );
};
