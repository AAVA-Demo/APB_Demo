import { useEffect, useState } from "react";
import { CaseResolutionsDto } from "../types/resolutions";
import { getPrioritizedResolutions } from "../api/resolutionsApi";

export function useResolutionSuggestions(caseId: string) {
  const [data, setData] = useState<CaseResolutionsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPrioritizedResolutions(caseId);
        setData(result);
      } catch (e: any) {
        const message = e?.response?.data ?? "Failed to load resolution suggestions.";
        setError(String(message));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [caseId]);

  return { data, loading, error };
}
