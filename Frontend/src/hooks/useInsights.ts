import { useEffect, useState } from "react";
import { insightsClient, RefreshInsightsRequest } from "../api/insightsClient";
import { MemberInsight } from "../types/memberInsight";
import { ApiError } from "../api/apiClient";

export function useInsights(memberId: string) {
    const [insights, setInsights] = useState<MemberInsight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memberId) {
            return;
        }
        setLoading(true);
        setError(null);
        insightsClient
            .getInsights(memberId)
            .then(setInsights)
            .catch((e: ApiError) => setError(e.message))
            .finally(() => setLoading(false));
    }, [memberId]);

    const refreshInsights = () => {
        if (!memberId) {
            return;
        }
        setLoading(true);
        setError(null);
        const request: RefreshInsightsRequest = { correlationId: crypto.randomUUID() };
        insightsClient
            .refreshInsights(memberId, request)
            .then(setInsights)
            .catch((e: ApiError) => setError(e.message))
            .finally(() => setLoading(false));
    };

    return { insights, loading, error, refreshInsights };
}
