import { useEffect, useState } from 'react';
import { DiagnosticPanelContextDto } from '../types/diagnosticPanelContext';
import { getDiagnosticPanelContext } from '../api/diagnosticPanelContextApi';

export function useDiagnosticPanelContext(memberIssueId: string) {
    const [context, setContext] = useState<DiagnosticPanelContextDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memberIssueId) return;
        setLoading(true);
        setError(null);
        getDiagnosticPanelContext(memberIssueId)
            .then(setContext)
            .catch(err => {
                setError(err.message);
                setContext(null);
            })
            .finally(() => setLoading(false));
    }, [memberIssueId]);

    return { context, loading, error };
}
