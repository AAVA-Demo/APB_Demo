import { useEffect, useState } from "react";
import { getDiagnosticInsights, createInsightsEventSource, notifyInsightsUpdate } from "../api/diagnosticInsightsApi";
import { DiagnosticInsightsResponse, DiagnosticInsightEvent, InsightsUpdateNotificationRequest } from "../types/diagnosticInsights";

export function useDiagnosticInsights(caseId: string) {
    const [data, setData] = useState<DiagnosticInsightsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let eventSource: EventSource | null = null;
        setLoading(true);
        setError(null);

        getDiagnosticInsights(caseId)
            .then(setData)
            .catch(err => setError(err.message || "Failed to load insights"))
            .finally(() => setLoading(false));

        eventSource = createInsightsEventSource(caseId);
        eventSource.onmessage = ev => {
            const evt = JSON.parse(ev.data) as DiagnosticInsightEvent;
            setData({ caseId: evt.caseId, insights: evt.insights, generatedAt: evt.generatedAt });
        };
        eventSource.onerror = () => {
            eventSource && eventSource.close();
        };

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [caseId]);

    const notifyUpdate = async (request: InsightsUpdateNotificationRequest) => {
        await notifyInsightsUpdate(caseId, request);
    };

    return { data, loading, error, notifyUpdate };
}
