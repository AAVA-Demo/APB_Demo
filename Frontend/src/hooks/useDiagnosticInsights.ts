import { useEffect, useState } from "react";
import { InsightViewModel, DiagnosticInsightsResponseDto, InsightsRefreshStatusDto } from "../types/diagnosticInsights";
import { getDiagnosticInsightsForCase, subscribeInsightsRefreshStreamForCase, triggerManualInsightsRefreshForCase, getInsightsRefreshStatusForCase } from "../api/diagnosticInsightsApi";

export function useDiagnosticInsights(caseId: string) {
    const [insights, setInsights] = useState<InsightViewModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshStatus, setRefreshStatus] = useState<string>("");
    const [lastRefreshUtc, setLastRefreshUtc] = useState<string>("");
    const [isStreaming, setIsStreaming] = useState<boolean>(false);

    useEffect(() => {
        let eventSource: EventSource | null = null;
        setIsLoading(true);
        setError(null);

        getDiagnosticInsightsForCase(caseId)
            .then(mapResponse)
            .then(data => {
                setInsights(data.insights);
                setLastRefreshUtc(data.lastRefreshUtc);
                setIsLoading(false);
                eventSource = subscribeInsightsRefreshStreamForCase(caseId);
                setIsStreaming(true);
                eventSource.onmessage = ev => {
                    const dto = JSON.parse(ev.data) as DiagnosticInsightsResponseDto;
                    const mapped = dto.insights.map(mapInsight);
                    setInsights(mapped);
                    setLastRefreshUtc(new Date().toISOString());
                };
                eventSource.onerror = () => {
                    setIsStreaming(false);
                    eventSource?.close();
                };
            })
            .catch(e => {
                setError(typeof e.message === "string" ? e.message : "Failed to load diagnostic insights.");
                setIsLoading(false);
            });

        getInsightsRefreshStatusForCase(caseId)
            .then((dto: InsightsRefreshStatusDto) => {
                setRefreshStatus(dto.refreshStatus);
                setLastRefreshUtc(dto.refreshedAtUtc.toString());
            })
            .catch(() => { /* ignore */ });

        return () => {
            eventSource?.close();
        };
    }, [caseId]);

    const triggerManualRefresh = () => {
        triggerManualInsightsRefreshForCase(caseId)
            .then(dto => {
                setRefreshStatus(dto.refreshStatus);
                setLastRefreshUtc(dto.refreshedAtUtc.toString());
            })
            .catch(e => setError(typeof e.message === "string" ? e.message : "Failed to refresh insights."));
    };

    function mapResponse(dto: DiagnosticInsightsResponseDto): { insights: InsightViewModel[]; lastRefreshUtc: string } {
        return {
            insights: dto.insights.map(mapInsight),
            lastRefreshUtc: new Date().toISOString()
        };
    }

    function mapInsight(i: any): InsightViewModel {
        return {
            insightId: i.insightId,
            title: i.title,
            description: i.description,
            confidence: i.confidence,
            status: i.status,
            lastUpdatedUtc: new Date(i.lastUpdatedUtc).toLocaleString(),
            remediationSteps: (i.remediationSteps || []).map((s: any) => ({
                stepId: s.stepId,
                order: s.order,
                text: s.text
            }))
        };
    }

    return { insights, isLoading, error, refreshStatus, lastRefreshUtc, isStreaming, triggerManualRefresh };
}
