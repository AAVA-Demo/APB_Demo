import { useEffect, useState } from 'react';
import { ContextRecommendationsDto } from '../types/contextRecommendations';
import { getContextAwareRecommendations } from '../api/contextRecommendationsApi';

export function useContextAwareRecommendations(memberIssueId: string) {
    const [data, setData] = useState<ContextRecommendationsDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memberIssueId) return;
        setLoading(true);
        setError(null);
        getContextAwareRecommendations(memberIssueId)
            .then(setData)
            .catch(err => {
                setError(err.message);
                setData(null);
            })
            .finally(() => setLoading(false));
    }, [memberIssueId]);

    return { data, loading, error };
}
