import React from "react";
import { useContextAwareRecommendations } from "../hooks/useContextAwareRecommendations";
import { RecommendationList } from "./RecommendationList";

interface Props {
  caseId: string;
}

export const ContextAwareRecommendationsSection: React.FC<Props> = ({ caseId }) => {
  const { data, loading, error } = useContextAwareRecommendations(caseId);

  return (
    <div className="p-3 border rounded mb-3">
      <h5>Context-aware Recommendations</h5>
      {loading && <div className="text-center py-3 spinner-border" />}
      {error && <div className="alert alert-danger p-2 mb-2">{error}</div>}
      {data && <RecommendationList data={data} />}
      {!loading && !error && data && data.recommendations.length === 0 && (
        <div className="text-muted">No recommendations available.</div>
      )}
    </div>
  );
};
