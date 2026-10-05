import { useEffect, useState } from "react";
import { recommendedActionsApi } from "../api/recommendedActionsApi";
import type { RecommendedAction } from "../types/recommendedActions";
import type { ApiError } from "../api/apiClient";

export function useRecommendedActions(issueId: string) {
    const [actions, setActions] = useState<RecommendedAction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!issueId) return;
        setLoading(true);
        setError(null);
        recommendedActionsApi
            .getRecommendedActions(issueId)
            .then((data) =>
                setActions(
                    [...data].sort(
                        (a, b) => a.priorityRank - b.priorityRank || b.impactScore - a.impactScore
                    )
                )
            )
            .catch((err: ApiError) => setError(err.message))
            .finally(() => setLoading(false));
    }, [issueId]);

    return { actions, loading, error };
}
