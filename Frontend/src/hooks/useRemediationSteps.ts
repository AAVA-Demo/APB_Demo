import { useEffect, useState } from 'react';
import { RemediationStep } from '../types/remediation';
import { remediationStepsApi } from '../api/remediationStepsApi';

export function useRemediationSteps(issueId: string) {
  const [steps, setSteps] = useState<RemediationStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await remediationStepsApi.getSteps(issueId);
        if (!cancelled) {
          setSteps(result);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load remediation steps');
        }
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

  return { steps, loading, error };
}
