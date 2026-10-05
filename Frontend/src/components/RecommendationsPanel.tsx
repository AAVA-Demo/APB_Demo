import React from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import { RecommendationContextRequest } from '../types/recommendations';
import { RecommendationItem } from './RecommendationItem';

interface Props {
  caseId: string;
  memberId: string;
  currentIssueSummary: string;
}

export const RecommendationsPanel: React.FC<Props> = ({ caseId, memberId, currentIssueSummary }) => {
  const context: RecommendationContextRequest = { memberId, currentIssueSummary };
  const { recommendations, loading, error } = useRecommendations(caseId, context);

  if (loading) {
    return <div className="p-3 text-center">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="alert alert-warning p-2">{error}</div>;
  }

  if (!recommendations.length) {
    return <div className="p-3 text-muted">No recommendations available.</div>;
  }

  return (
    <div className="p-3 border rounded mt-3">
      <h5 className="mb-3">Recommendations</h5>
      <ul className="list-unstyled mb-0">
        {recommendations.map((rec) => (
          <RecommendationItem key={rec.id} recommendation={rec} />
        ))}
      </ul>
    </div>
  );
};
