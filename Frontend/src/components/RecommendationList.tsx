import React from "react";
import { ContextAwareRecommendationsDto } from "../types/contextAwareRecommendations";
import { RecommendationItem } from "./RecommendationItem";

interface Props {
  data: ContextAwareRecommendationsDto;
}

export const RecommendationList: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <div className="mb-2">
        {data.symptoms.map((s) => (
          <span key={s} className="badge bg-secondary me-1 mb-1">
            Symptom: {s}
          </span>
        ))}
        {data.recentInteractions.map((i) => (
          <span key={i} className="badge bg-info text-dark me-1 mb-1">
            Interaction: {i}
          </span>
        ))}
      </div>
      {data.recommendations.map((rec) => (
        <RecommendationItem key={rec.id} recommendation={rec} />
      ))}
      {data.recommendations.length === 0 && <div className="text-muted">No recommendations.</div>}
    </div>
  );
};
