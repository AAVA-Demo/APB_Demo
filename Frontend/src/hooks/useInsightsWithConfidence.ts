import { useEffect, useState } from "react";
import { InsightWithConfidenceViewModel, InsightsWithConfidenceResponseDto } from "../types/insightConfidence";
import { getInsightsWithConfidenceForCase } from "../api/insightConfidenceApi";

export function useInsightsWithConfidence(caseId: string) {
    const [insights, setInsights] = useState<InsightWithConfidenceViewModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getInsightsWithConfidenceForCase(caseId)
            .then(mapResponse)
            .then(setInsights)
            .catch(e => setError(typeof e.message === "string" ? e.message : "Failed to load insights with confidence."))
            .finally(() => setIsLoading(false));
    }, [caseId]);

    function mapResponse(dto: InsightsWithConfidenceResponseDto): InsightWithConfidenceViewModel[] {
        return dto.insights.map(i => ({
            insightId: i.insightId,
            title: i.title,
            description: i.description,
            confidenceScore: i.confidenceScore,
            confidenceLevel: i.confidenceLevel,
            confidenceLabel: i.confidenceLabel,
            remediationSteps: i.remediationSteps.map(s => ({
                stepId: s.stepId,
                order: s.order,
                text: s.text
            }))
        }));
    }

    return { insights, isLoading, error };
}
