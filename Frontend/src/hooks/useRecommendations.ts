import { useEffect, useState } from "react";
import { recommendationsApi } from "../api/recommendationsApi";
import type { Recommendation } from "../types/recommendations";
import type { ApiError } from "../api/apiClient";

export function useRecommendations(issueId: string) {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!issueId) return;
        setLoading(true);
        setError(null);
        recommendationsApi
            .getRecommendations(issueId)
            .then(setRecommendations)
            .catch((err: ApiError) => setError(err.message))
            .finally(() => setLoading(false));
    }, [issueId]);

    return { recommendations, loading, error };
}
