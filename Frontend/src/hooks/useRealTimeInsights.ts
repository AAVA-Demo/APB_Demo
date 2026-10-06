import { useEffect, useState } from "react";
import { RealTimeInsightDto } from "../types/realtimeInsight";
import { getLatestInsights } from "../api/realTimeInsightsApi";

export function useRealTimeInsights(caseId: string) {
    const [data, setData] = useState<RealTimeInsightDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getLatestInsights(caseId);
            setData(result);
        } catch (e: any) {
            setError("Failed to load latest insights.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (caseId) {
            load();
            const interval = setInterval(load, 30000);
            return () => clearInterval(interval);
        }
    }, [caseId]);

    return { data, loading, error, refresh: load };
}
