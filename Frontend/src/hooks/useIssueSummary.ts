import { useEffect, useState } from "react";
import { getIssueSummary } from "../api/issueSummaryApi";
import { IssueSummaryResponse } from "../types/issueSummary";

export function useIssueSummary(memberId: string, issueId: string) {
  const [summary, setSummary] = useState<IssueSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getIssueSummary(memberId, issueId)
      .then((response) => {
        if (!isMounted) return;
        setSummary(response);
        setLoading(false);
      })
      .catch((e) => {
        if (!isMounted) return;
        setError(e.message ?? "Summary unavailable");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [memberId, issueId]);

  return { summary, loading, error };
}
