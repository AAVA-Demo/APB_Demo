import { useEffect, useState } from 'react';
import { RemediationGuidanceDto } from '../types/remediationGuidance';
import { getRemediationGuidance } from '../api/remediationGuidanceApi';

export function useRemediationGuidance(memberIssueId: string) {
    const [guidance, setGuidance] = useState<RemediationGuidanceDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memberIssueId) return;
        setLoading(true);
        setError(null);
        getRemediationGuidance(memberIssueId)
            .then(setGuidance)
            .catch(err => {
                setError(err.message);
                setGuidance(null);
            })
            .finally(() => setLoading(false));
    }, [memberIssueId]);

    return { guidance, loading, error };
}
