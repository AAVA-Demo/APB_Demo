import { useState } from "react";
import { getRecommendationExplanation } from "../api/recommendationExplanationApi";
import { RecommendationExplanationDto } from "../types/recommendationExplanation";

export const useRecommendationExplanation = (
    caseId: string,
    insightId: string,
    recommendationId: string
) => {
    const [data, setData] = useState<RecommendationExplanationDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        setError(null);
        getRecommendationExplanation(caseId, insightId, recommendationId)
            .then(setData)
            .catch(err => {
                setError(err.message ?? "Unable to load explanation.");
            })
            .finally(() => setLoading(false));
    };

    return { data, loading, error, load };
};
