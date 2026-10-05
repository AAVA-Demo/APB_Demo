import { useEffect, useState } from 'react';
import { DiagnosticInsights } from '../types/diagnosticInsights';
import { diagnosticInsightsApi } from '../api/diagnosticInsightsApi';

export function useDiagnosticInsights(caseId: string) {
  const [data, setData] = useState<DiagnosticInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let intervalId: number | undefined;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await diagnosticInsightsApi.getInsights(caseId);
        if (!cancelled) {
          setData(result);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load diagnostic insights');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    intervalId = window.setInterval(load, 20000);

    return () => {
      cancelled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [caseId]);

  return { data, loading, error };
}
