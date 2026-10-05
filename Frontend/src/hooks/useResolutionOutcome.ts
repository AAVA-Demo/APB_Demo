import { useEffect, useState } from 'react';
import { ResolutionOutcome, CreateResolutionOutcomeRequest } from '../types/resolutionOutcome';
import { resolutionOutcomeApi } from '../api/resolutionOutcomeApi';

export function useResolutionOutcome(issueId: string) {
  const [outcome, setOutcome] = useState<ResolutionOutcome | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<'Resolved' | 'NotResolved' | ''>('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const existing = await resolutionOutcomeApi.getOutcome(issueId);
        if (!cancelled) {
          setOutcome(existing);
          setSelectedOutcome(existing.outcome);
          setComments(existing.comments ?? '');
        }
      } catch {
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [issueId]);

  const submit = async () => {
    if (!selectedOutcome) {
      setError('Please select an outcome');
      return;
    }

    const request: CreateResolutionOutcomeRequest = {
      outcome: selectedOutcome,
      comments: comments || undefined,
    };

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const result = outcome
        ? await resolutionOutcomeApi.updateOutcome(issueId, request)
        : await resolutionOutcomeApi.createOutcome(issueId, request);
      setOutcome(result);
      setSuccess('Outcome saved');
    } catch {
      setError('Failed to save outcome');
    } finally {
      setLoading(false);
    }
  };

  return {
    outcome,
    selectedOutcome,
    setSelectedOutcome,
    comments,
    setComments,
    loading,
    error,
    success,
    submit,
  };
}
