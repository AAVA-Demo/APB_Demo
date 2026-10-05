import { useEffect, useState } from "react";
import { RealTimeInsightsResponse } from "../types/realTimeInsights";
import { getRealTimeInsights } from "../api/realTimeInsightsApi";

export function useRealTimeInsights(caseId: string, token?: string) {
    const [data, setData] = useState<RealTimeInsightsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        let delay = 5000;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getRealTimeInsights(caseId, token);
                if (!cancelled) {
                    setData(response);
                    setError(null);
                }
            } catch (e: any) {
                if (!cancelled) {
                    setError(e.message || "Failed to load real-time insights");
                    delay = Math.min(delay * 2, 60000);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        const interval = setInterval(fetchData, delay);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [caseId, token]);

    return { data, loading, error };
}
