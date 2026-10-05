import { useEffect, useState } from "react";
import { getRootCauseRecommendations } from "../api/rootCauseRecommendationApi";
import { RootCauseRecommendationResponse } from "../types/rootCause";

export function useRootCauseRecommendations(caseId: string) {
    const [data, setData] = useState<RootCauseRecommendationResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getRootCauseRecommendations(caseId)
            .then(setData)
            .catch(err => setError(err.message || "Failed to load root cause recommendations"))
            .finally(() => setLoading(false));
    }, [caseId]);

    return { data, loading, error };
}
