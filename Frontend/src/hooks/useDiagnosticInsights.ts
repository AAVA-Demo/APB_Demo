import { useEffect, useState } from 'react';
import { DiagnosticInsightsDto } from '../types/diagnosticInsights';
import { getRealTimeDiagnosticInsights } from '../api/diagnosticInsightsApi';

export function useDiagnosticInsights(memberIssueId: string) {
    const [insights, setInsights] = useState<DiagnosticInsightsDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memberIssueId) {
            return;
        }
        setLoading(true);
        setError(null);
        getRealTimeDiagnosticInsights(memberIssueId)
            .then(data => {
                setInsights(data);
            })
            .catch(err => {
                setError(err.message);
                setInsights(null);
            })
            .finally(() => setLoading(false));
    }, [memberIssueId]);

    return { insights, loading, error };
}
