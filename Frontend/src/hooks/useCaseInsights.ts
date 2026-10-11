import { useEffect, useState } from "react";
import { CaseInsightsDto } from "../types/insights";
import { getInsightsWithConfidence } from "../api/insightsApi";

export function useCaseInsights(caseId: string) {
  const [data, setData] = useState<CaseInsightsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getInsightsWithConfidence(caseId);
        setData(result);
      } catch (e: any) {
        const message = e?.response?.data ?? "Failed to load insights.";
        setError(String(message));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [caseId]);

  return { data, loading, error };
}
