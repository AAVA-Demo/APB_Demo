import { useEffect, useState } from "react";
import { RealTimeDiagnosticInsightsResponseDto } from "../types/diagnosticInsights";
import { ContextAwareRecommendationsResponseDto } from "../types/recommendations";
import { AiInsightsResponseDto } from "../types/aiInsights";
import { getRealTimeDiagnosticInsights } from "../api/aiDiagnosticApi";
import { getContextAwareRecommendations } from "../api/recommendationApi";
import { getAiInsightsWithConfidence } from "../api/aiInsightsApi";

export function useAiDiagnosticPanel(interactionId: string) {
  const [diagnosticInsights, setDiagnosticInsights] = useState<RealTimeDiagnosticInsightsResponseDto | null>(null);
  const [recommendations, setRecommendations] = useState<ContextAwareRecommendationsResponseDto | null>(null);
  const [aiInsights, setAiInsights] = useState<AiInsightsResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [diag, recs, insights] = await Promise.all([
        getRealTimeDiagnosticInsights(interactionId),
        getContextAwareRecommendations(interactionId),
        getAiInsightsWithConfidence(interactionId),
      ]);
      setDiagnosticInsights(diag);
      setRecommendations(recs);
      setAiInsights(insights);
    } catch (e: any) {
      setError(e.message || "Failed to load AI diagnostics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interactionId) {
      load();
    }
  }, [interactionId]);

  return { diagnosticInsights, recommendations, aiInsights, loading, error, reload: load };
}
