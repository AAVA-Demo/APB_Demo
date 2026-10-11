import React from "react";
import { InsightDto } from "../types/insights";
import { InsightConfidenceBadge } from "./InsightConfidenceBadge";

interface Props {
  insights: InsightDto[];
  title: string;
}

export const InsightList: React.FC<Props> = ({ insights, title }) => {
  return (
    <div className="mb-3">
      <h6>{title}</h6>
      {insights.map((i) => (
        <div key={i.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
          <div>{i.text}</div>
          <InsightConfidenceBadge confidenceLevel={i.confidenceLevel} confidenceScore={i.confidenceScore} />
        </div>
      ))}
      {insights.length === 0 && <div className="text-muted">No items.</div>}
    </div>
  );
};
