import { useEffect, useState } from "react";
import { recommendationsClient } from "../api/recommendationsClient";
import { Recommendation } from "../types/recommendation";
import { ApiError } from "../api/apiClient";

export function useRecommendations(memberId: string) {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memberId) {
            return;
        }
        setLoading(true);
        setError(null);
        recommendationsClient
            .getRecommendations(memberId)
            .then(setRecommendations)
            .catch((e: ApiError) => setError(e.message))
            .finally(() => setLoading(false));
    }, [memberId]);

    return { recommendations, loading, error };
}
