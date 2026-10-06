import { useEffect, useState } from 'react';
import { NextBestActionPromptDto } from '../types/nextBestAction';
import { getNextBestActionPrompt } from '../api/nextBestActionApi';

export function useNextBestActionPrompt(memberIssueId: string) {
    const [prompt, setPrompt] = useState<NextBestActionPromptDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memberIssueId) return;
        setLoading(true);
        setError(null);
        getNextBestActionPrompt(memberIssueId)
            .then(setPrompt)
            .catch(err => {
                setError(err.message);
                setPrompt(null);
            })
            .finally(() => setLoading(false));
    }, [memberIssueId]);

    return { prompt, loading, error };
}
