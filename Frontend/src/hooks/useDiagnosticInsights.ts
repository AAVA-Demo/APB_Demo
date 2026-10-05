import { useEffect, useState } from "react";
import { diagnosticsClient } from "../api/diagnosticsClient";
import { DiagnosticInsight } from "../types/diagnostic";
import { ApiError } from "../api/apiClient";

export function useDiagnosticInsights(memberId: string) {
    const [insights, setInsights] = useState<DiagnosticInsight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memberId) {
            return;
        }
        setLoading(true);
        setError(null);
        diagnosticsClient
            .getDiagnosticInsights(memberId)
            .then(setInsights)
            .catch((e: ApiError) => setError(e.message))
            .finally(() => setLoading(false));
    }, [memberId]);

    return { insights, loading, error };
}
