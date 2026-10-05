import React from "react";
import { MemberImpactRecommendationViewModel } from "../types/memberImpact";

interface Props {
  recommendations: MemberImpactRecommendationViewModel[];
}

export const MemberImpactRecommendationList: React.FC<Props> = ({
  recommendations,
}) => {
  if (recommendations.length === 0) {
    return <p className="text-muted mb-0">No recommendations.</p>;
  }

  return (
    <ul className="list-group mt-2">
      {recommendations.map((rec) => (
        <li
          key={rec.recommendationId}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span>{rec.description}</span>
          <span className="badge bg-secondary">{rec.impactLabel}</span>
        </li>
      ))}
    </ul>
  );
};
