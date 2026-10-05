import { useEffect, useState } from 'react';
import { Recommendation, RecommendationContextRequest } from '../types/recommendations';
import { recommendationsApi } from '../api/recommendationsApi';

export function useRecommendations(caseId: string, contextRequest: RecommendationContextRequest) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await recommendationsApi.getRecommendations(caseId, contextRequest);
        if (!cancelled) {
          setRecommendations(result);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load recommendations');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [caseId, contextRequest.memberId, contextRequest.currentIssueSummary]);

  return { recommendations, loading, error };
}
