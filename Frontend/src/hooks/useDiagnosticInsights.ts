import { useEffect, useState } from "react";
import { diagnosticInsightsApi } from "../api/diagnosticInsightsApi";
import type { DiagnosticInsight } from "../types/diagnosticInsights";
import type { ApiError } from "../api/apiClient";

export function useDiagnosticInsights(caseId: string) {
    const [insights, setInsights] = useState<DiagnosticInsight[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        setError(null);
        diagnosticInsightsApi
            .getDiagnosticInsights(caseId)
            .then(setInsights)
            .catch((err: ApiError) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (caseId) {
            load();
        }
    }, [caseId]);

    return { insights, loading, error, refresh: load };
}
