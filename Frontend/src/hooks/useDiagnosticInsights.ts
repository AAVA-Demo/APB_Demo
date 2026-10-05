import { useEffect, useState } from 'react';
import { Insight } from '../types/Insight';
import { getInsights, getInsightStream } from '../api/diagnosticsClient';
import { RealTimeConnection } from '../types/RealTimeConnection';

interface UseDiagnosticInsightsResult {
    insights: Insight[];
    loading: boolean;
    error: string | null;
}

export function useDiagnosticInsights(issueId: string): UseDiagnosticInsightsResult {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        getInsights(issueId)
            .then((data) => {
                if (!isMounted) return;
                setInsights(data);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err.message || 'Error loading insights');
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });

        let ws: WebSocket | null = null;

        getInsightStream(issueId)
            .then((connection: RealTimeConnection) => {
                if (!isMounted) return;
                ws = new WebSocket(connection.connectionUrl);
                ws.onmessage = (event) => {
                    try {
                        const payload = JSON.parse(event.data) as Insight[];
                        setInsights(payload);
                    } catch {
                        // ignore malformed messages
                    }
                };
            })
            .catch(() => {
                // non-blocking; real-time optional
            });

        return () => {
            isMounted = false;
            if (ws) {
                ws.close();
            }
        };
    }, [issueId]);

    return { insights, loading, error };
}
