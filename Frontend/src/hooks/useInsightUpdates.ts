import { useEffect, useState } from "react";
import { getCurrentInsights } from "../api/insightsApi";
import { CurrentInsightsDto } from "../types/realTimeInsights";

export const useInsightUpdates = (caseId: string) => {
    const [data, setData] = useState<CurrentInsightsDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);

    const load = () => {
        setLoading(true);
        setError(null);
        getCurrentInsights(caseId)
            .then(dto => {
                setData(dto);
            })
            .catch(err => {
                setError(err.message ?? "Failed to load insights.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!caseId) {
            return;
        }
        load();
        setConnected(true);
        return () => {
            setConnected(false);
        };
    }, [caseId]);

    return { data, loading, error, connected, reload: load };
};
