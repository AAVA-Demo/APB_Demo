import { useEffect, useState } from "react";
import { InsightConfidenceDetailsViewModel } from "../types/insightConfidence";
import { getInsightConfidenceDetails } from "../api/insightConfidenceApi";

export function useInsightConfidenceDetails(insightId: string | null, isOpen: boolean) {
    const [details, setDetails] = useState<InsightConfidenceDetailsViewModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!insightId || !isOpen) {
            return;
        }
        setIsLoading(true);
        setError(null);
        getInsightConfidenceDetails(insightId)
            .then(dto => setDetails({
                insightId: dto.insightId,
                confidenceScore: dto.confidenceScore,
                confidenceLevel: dto.confidenceLevel,
                confidenceLabel: dto.confidenceLabel,
                explanation: dto.explanation
            }))
            .catch(e => setError(typeof e.message === "string" ? e.message : "Failed to load confidence details."))
            .finally(() => setIsLoading(false));
    }, [insightId, isOpen]);

    return { details, isLoading, error };
}
