import React from "react";
import { InsightDto } from "../types/realTimeInsights";
import { InsightItem } from "./InsightItem";

interface Props {
  insights: InsightDto[];
}

export const InsightFeed: React.FC<Props> = ({ insights }) => {
  const ordered = [...insights].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return (
    <div>
      {ordered.map((insight) => (
        <InsightItem key={insight.id} insight={insight} />
      ))}
      {ordered.length === 0 && <div className="text-muted">No insights.</div>}
    </div>
  );
};
