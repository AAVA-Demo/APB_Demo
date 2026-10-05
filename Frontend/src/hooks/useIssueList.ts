import { useEffect, useState } from 'react';
import { Issue } from '../types/issues';
import { issueApi } from '../api/issueApi';

export function useIssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await issueApi.getActiveIssues();
        if (!cancelled) {
          setIssues(result);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load issues');
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
  }, []);

  return { issues, loading, error };
}
