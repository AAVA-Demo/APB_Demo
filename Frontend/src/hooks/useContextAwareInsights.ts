import { useEffect, useState } from "react";
import { getContextAwareInsights } from "../api/contextAwareInsightsApi";
import { ContextAwareInsightsResponse } from "../types/contextAwareInsights";

export function useContextAwareInsights(memberId: string, caseId: string) {
    const [data, setData] = useState<ContextAwareInsightsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getContextAwareInsights(memberId, caseId)
            .then(setData)
            .catch(err => setError(err.message || "Failed to load context-aware insights"))
            .finally(() => setLoading(false));
    }, [memberId, caseId]);

    return { data, loading, error };
}
