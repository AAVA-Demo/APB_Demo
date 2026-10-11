import React from "react";
import { InsightDto } from "../types/insights";
import { InsightConfidenceBadge } from "./InsightConfidenceBadge";

interface Props {
  remediations: InsightDto[];
}

export const RemediationList: React.FC<Props> = ({ remediations }) => {
  return (
    <div className="mb-3">
      <h6>Remediations</h6>
      {remediations.map((r) => (
        <div key={r.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
          <div>{r.text}</div>
          <InsightConfidenceBadge confidenceLevel={r.confidenceLevel} confidenceScore={r.confidenceScore} />
        </div>
      ))}
      {remediations.length === 0 && <div className="text-muted">No remediations.</div>}
    </div>
  );
};
