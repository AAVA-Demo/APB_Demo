import { useEffect, useState } from "react";
import { CaseRealTimeInsightsDto } from "../types/realTimeInsights";
import { getRealTimeInsights } from "../api/realTimeInsightsApi";

export function useRealTimeInsights(caseId: string) {
  const [data, setData] = useState<CaseRealTimeInsightsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!caseId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getRealTimeInsights(caseId);
      setData(result);
    } catch (e: any) {
      const message = e?.response?.data ?? "Failed to load real-time insights.";
      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [caseId]);

  return { data, loading, error, refresh: load };
}
