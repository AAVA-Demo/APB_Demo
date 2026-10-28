import React from "react";
import { DiagnosticInsight } from "../types/diagnosticInsights";
import { DiagnosticInsightItem } from "./DiagnosticInsightItem";

export interface DiagnosticInsightsListProps {
  insights: DiagnosticInsight[];
}

export const DiagnosticInsightsList: React.FC<DiagnosticInsightsListProps> = ({ insights }) => {
  if (!insights.length) {
    return <div className="text-muted">No diagnostic insights available.</div>;
  }

  return (
    <div className="list-group">
      {insights.map(insight => (
        <DiagnosticInsightItem key={insight.insightId} insight={insight} />
      ))}
    </div>
  );
};
