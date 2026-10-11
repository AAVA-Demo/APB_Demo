import { useEffect, useState } from "react";
import { ContextAwareRecommendationsDto } from "../types/contextAwareRecommendations";
import { getContextAwareRecommendations } from "../api/contextAwareRecommendationsApi";

export function useContextAwareRecommendations(caseId: string) {
  const [data, setData] = useState<ContextAwareRecommendationsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getContextAwareRecommendations(caseId);
        setData(result);
      } catch (e: any) {
        const message = e?.response?.data ?? "Failed to load recommendations.";
        setError(String(message));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [caseId]);

  return { data, loading, error };
}
