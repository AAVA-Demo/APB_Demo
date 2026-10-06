import { useEffect, useState } from "react";
import { RealTimeInsightViewModel, RealTimeInsightsResponseDto } from "../types/realTimeInsights";
import { analyzeCaseRealTime, getRealTimeInsights, subscribeRealTimeInsightsStream } from "../api/realTimeInsightsApi";

export function useRealTimeInsights(caseId: string) {
    const [insights, setInsights] = useState<RealTimeInsightViewModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);

    useEffect(() => {
        let eventSource: EventSource | null = null;
        setIsLoading(true);
        setError(null);

        getRealTimeInsights(caseId)
            .then(mapResponse)
            .then(data => {
                setInsights(data);
                setIsLoading(false);
                eventSource = subscribeRealTimeInsightsStream(caseId);
                setIsStreaming(true);
                eventSource.onmessage = ev => {
                    const dto = JSON.parse(ev.data) as RealTimeInsightsResponseDto;
                    setInsights(dto.insights.map(mapInsight));
                };
                eventSource.onerror = () => {
                    setIsStreaming(false);
                    eventSource?.close();
                };
            })
            .catch(e => {
                setError(typeof e.message === "string" ? e.message : "Failed to load real-time insights.");
                setIsLoading(false);
            });

        return () => {
            eventSource?.close();
        };
    }, [caseId]);

    const triggerAnalyze = () => {
        analyzeCaseRealTime(caseId)
            .then(mapAnalysis)
            .then(data => setInsights(data))
            .catch(e => setError(typeof e.message === "string" ? e.message : "Failed to analyze case."));
    };

    function mapResponse(dto: RealTimeInsightsResponseDto): RealTimeInsightViewModel[] {
        return dto.insights.map(mapInsight);
    }

    function mapAnalysis(dto: RealTimeInsightsResponseDto): RealTimeInsightViewModel[] {
        return dto.insights.map(mapInsight);
    }

    function mapInsight(i: RealTimeInsightViewModel | any): RealTimeInsightViewModel {
        return {
            insightId: i.insightId,
            title: i.title,
            description: i.description,
            severity: i.severity,
            createdAt: new Date(i.createdAtUtc).toLocaleString()
        };
    }

    return { insights, isLoading, error, isStreaming, triggerAnalyze };
}
