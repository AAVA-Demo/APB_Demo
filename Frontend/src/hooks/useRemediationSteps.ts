import { useEffect, useState } from 'react';
import { RemediationStep } from '../types/RemediationStep';
import { getRemediationSteps } from '../api/remediationClient';

interface UseRemediationStepsResult {
    steps: RemediationStep[];
    loading: boolean;
    error: string | null;
}

export function useRemediationSteps(insightId: string): UseRemediationStepsResult {
    const [steps, setSteps] = useState<RemediationStep[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        getRemediationSteps(insightId)
            .then((data) => {
                if (!isMounted) return;
                setSteps(data);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err.message || 'Error loading remediation');
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [insightId]);

    return { steps, loading, error };
}
