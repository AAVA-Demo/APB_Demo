import { useEffect, useState } from "react";
import {
  DiagnosticInsightViewModel,
  DiagnosticInsightsResponse,
} from "../types/diagnosticInsights";
import { getCurrentDiagnosticInsights } from "../api/diagnosticInsightsApi";

export function useDiagnosticInsights(memberId: string) {
  const [insights, setInsights] = useState<DiagnosticInsightViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getCurrentDiagnosticInsights(memberId)
      .then((response: DiagnosticInsightsResponse) => {
        if (!isMounted) return;
        const lastUpdatedLabel = new Date(
          response.lastUpdated
        ).toLocaleTimeString();
        const mapped = response.insights.map((i) => ({
          insightId: i.insightId,
          summary: i.summary,
          severity: i.severity,
          lastUpdatedLabel,
        }));
        setInsights(mapped);
        setLoading(false);
      })
      .catch((e) => {
        if (!isMounted) return;
        setError(e.message ?? "Failed to load insights");
        setLoading(false);
      });

    const source = new EventSource(
      `api/diagnostics/members/${encodeURIComponent(
        memberId
      )}/insights-stream`
    );

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as DiagnosticInsightsResponse;
        const lastUpdatedLabel = new Date(
          data.lastUpdated
        ).toLocaleTimeString();
        const mapped = data.insights.map((i) => ({
          insightId: i.insightId,
          summary: i.summary,
          severity: i.severity,
          lastUpdatedLabel,
        }));
        setInsights(mapped);
      } catch {
        // ignore malformed events
      }
    };

    source.onerror = () => {
      source.close();
    };

    return () => {
      isMounted = false;
      source.close();
    };
  }, [memberId]);

  return { insights, loading, error };
}
