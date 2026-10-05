import { useEffect, useState } from 'react';
import { MemberContext } from '../types/MemberContext';
import { getMemberContext } from '../api/memberContextClient';

interface UseMemberIssueContextResult {
    context: MemberContext | null;
    loading: boolean;
    error: string | null;
}

export function useMemberIssueContext(memberId: string, caseId: string): UseMemberIssueContextResult {
    const [context, setContext] = useState<MemberContext | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        getMemberContext(memberId, caseId)
            .then((data) => {
                if (!isMounted) return;
                setContext(data);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err.message || 'Error loading member context');
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [memberId, caseId]);

    return { context, loading, error };
}
