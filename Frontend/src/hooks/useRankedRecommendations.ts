import { useEffect, useState } from "react";
import { RankedRecommendationResponseDto } from "../types/recommendation";
import { getRankedRecommendations } from "../api/recommendationApi";

export function useRankedRecommendations(interactionId: string) {
    const [data, setData] = useState<RankedRecommendationResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!interactionId) {
            return;
        }

        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const result = await getRankedRecommendations(interactionId);
                if (!cancelled) {
                    setData(result);
                }
            } catch {
                if (!cancelled) {
                    setError("Recommendations unavailable");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [interactionId]);

    return { data, loading, error };
}
