import React from "react";
import { AiInsight } from "../types/aiInsights";

export interface AiInsightItemProps {
  insight: AiInsight;
}

export const AiInsightItem: React.FC<AiInsightItemProps> = ({ insight }) => {
  const level = insight.confidenceLevel || "Unknown";
  const badgeClass = level === "High" ? "bg-success" : level === "Medium" ? "bg-primary" : "bg-secondary";

  return (
    <div className="list-group-item">
      <div className="d-flex justify-content-between">
        <div>
          <div>{insight.title}</div>
          <div className="small text-muted">{insight.description}</div>
        </div>
        <div className="text-end">
          <span className={`badge ${badgeClass} mb-1`}>{level}</span>
          <div className="small text-muted">Score: {insight.confidenceScore.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
