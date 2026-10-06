import { useEffect, useState } from 'react';
import { AiAssistedResolutionMetricsDto } from '../types/aiAssistedMetrics';
import { getAiAssistedResolutionMetrics } from '../api/aiAssistedMetricsApi';

export function useAiAssistedResolutionMetrics(fromDate: string, toDate: string) {
    const [metrics, setMetrics] = useState<AiAssistedResolutionMetricsDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!fromDate || !toDate) return;
        setLoading(true);
        setError(null);
        getAiAssistedResolutionMetrics(fromDate, toDate)
            .then(setMetrics)
            .catch(err => {
                setError(err.message);
                setMetrics(null);
            })
            .finally(() => setLoading(false));
    }, [fromDate, toDate]);

    return { metrics, loading, error };
}
