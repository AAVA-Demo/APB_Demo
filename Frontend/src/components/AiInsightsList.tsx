import React from "react";
import { AiInsight } from "../types/aiInsights";
import { AiInsightItem } from "./AiInsightItem";

export interface AiInsightsListProps {
  insights: AiInsight[];
}

export const AiInsightsList: React.FC<AiInsightsListProps> = ({ insights }) => {
  if (!insights.length) {
    return <div className="text-muted">No AI insights available.</div>;
  }

  return (
    <div className="list-group">
      {insights.map(insight => (
        <AiInsightItem key={insight.insightId} insight={insight} />
      ))}
    </div>
  );
};
