import React, { useState } from "react";
import { Recommendation } from "../types/recommendations";

export interface RecommendationItemProps {
  recommendation: Recommendation;
}

export const RecommendationItem: React.FC<RecommendationItemProps> = ({ recommendation }) => {
  const [expanded, setExpanded] = useState(false);
  const limitedContext = !recommendation.contextSummary;

  return (
    <button type="button" className="list-group-item list-group-item-action" onClick={() => setExpanded(!expanded)}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div>{recommendation.title}</div>
          {expanded && <div className="small text-muted mt-1">{recommendation.description}</div>}
        </div>
        {limitedContext ? (
          <span className="badge bg-warning text-dark">Limited context</span>
        ) : (
          <span className="badge bg-info text-dark">Context: {recommendation.contextSummary}</span>
        )}
      </div>
    </button>
  );
};
