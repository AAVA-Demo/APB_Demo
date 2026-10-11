import React from "react";
import { InsightDto } from "../types/realTimeInsights";

interface Props {
  insight: InsightDto;
}

function relativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes <= 0) return "Just now";
  if (minutes === 1) return "1 minute ago";
  return `${minutes} minutes ago`;
}

export const InsightItem: React.FC<Props> = ({ insight }) => {
  return (
    <div className="mb-2 p-2 border rounded">
      <div className="small text-muted mb-1">{relativeTime(insight.timestamp)}</div>
      <div>{insight.text}</div>
    </div>
  );
};
