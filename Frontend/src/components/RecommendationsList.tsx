import React from "react";
import { Recommendation } from "../types/recommendations";
import { RecommendationItem } from "./RecommendationItem";

export interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  if (!recommendations.length) {
    return <div className="text-muted">No recommendations available.</div>;
  }

  return (
    <div className="list-group">
      {recommendations.map(rec => (
        <RecommendationItem key={rec.recommendationId} recommendation={rec} />
      ))}
    </div>
  );
};
