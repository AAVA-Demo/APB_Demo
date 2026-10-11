import { useEffect, useState } from "react";
import { CaseRemediationStepsDto } from "../types/remediationSteps";
import { getRemediationSteps } from "../api/remediationStepsApi";

export function useRemediationSteps(caseId: string) {
  const [data, setData] = useState<CaseRemediationStepsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getRemediationSteps(caseId);
        setData(result);
      } catch (e: any) {
        const message = e?.response?.data ?? "Failed to load remediation steps.";
        setError(String(message));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [caseId]);

  return { data, loading, error };
}
