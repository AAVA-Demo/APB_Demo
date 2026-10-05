import React from "react";
import { DiagnosticInsightViewModel } from "../types/diagnosticInsights";

interface Props {
  insights: DiagnosticInsightViewModel[];
}

export const DiagnosticInsightList: React.FC<Props> = ({ insights }) => {
  return (
    <ul className="list-group">
      {insights.map((insight) => (
        <li
          key={insight.insightId}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <div className="fw-semibold">{insight.summary}</div>
            <small className="text-muted">
              Last updated: {insight.lastUpdatedLabel}
            </small>
          </div>
          <span className="badge bg-secondary ms-2">{insight.severity}</span>
        </li>
      ))}
    </ul>
  );
};
