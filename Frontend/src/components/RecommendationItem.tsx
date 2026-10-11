import React, { useState } from "react";
import { RecommendationDto } from "../types/contextAwareRecommendations";

interface Props {
  recommendation: RecommendationDto;
}

export const RecommendationItem: React.FC<Props> = ({ recommendation }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-2 p-2 border rounded">
      <div className="d-flex justify-content-between">
        <div>{recommendation.text}</div>
        <button
          className="btn btn-sm btn-outline-secondary ms-2"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "Hide" : "Details"}
        </button>
      </div>
      {expanded && (
        <div className="mt-2">
          <div className="mb-1">
            {recommendation.referencedSymptoms.map((s) => (
              <span key={s} className="badge bg-secondary me-1 mb-1">
                Symptom: {s}
              </span>
            ))}
          </div>
          <div>
            {recommendation.referencedInteractions.map((i) => (
              <span key={i} className="badge bg-info text-dark me-1 mb-1">
                Interaction: {i}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
