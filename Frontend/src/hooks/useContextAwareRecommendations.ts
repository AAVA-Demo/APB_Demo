import { useEffect, useState } from "react";
import { RecommendationSetDto } from "../types/recommendation";
import { getContextAwareRecommendations } from "../api/contextAwareRecommendationsApi";

export function useContextAwareRecommendations(caseId: string) {
    const [data, setData] = useState<RecommendationSetDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getContextAwareRecommendations(caseId);
            setData(result);
        } catch (e: any) {
            if (e.response?.status === 404) {
                setError("Case context not found.");
            } else if (e.response?.status === 503) {
                setError("Recommendations temporarily unavailable.");
            } else {
                setError("Failed to load recommendations.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (caseId) {
            load();
        }
    }, [caseId]);

    return { data, loading, error, refresh: load };
}
