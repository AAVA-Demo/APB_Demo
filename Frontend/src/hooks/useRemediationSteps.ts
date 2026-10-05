import { useEffect, useState } from "react";
import {
  RemediationStepResponse,
  RemediationStepViewModel,
} from "../types/remediationStep";
import { getRemediationSteps } from "../api/remediationStepApi";

export function useRemediationSteps(memberId: string, issueId: string) {
  const [steps, setSteps] = useState<RemediationStepViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getRemediationSteps(memberId, issueId)
      .then((response: RemediationStepResponse) => {
        if (!isMounted) return;
        const mapped = response.steps.map((s) => ({
          stepId: s.stepId,
          description: s.description,
          orderIndex: s.orderIndex,
          completed: s.completed,
        }));
        setSteps(mapped);
        setLoading(false);
      })
      .catch((e) => {
        if (!isMounted) return;
        setError(e.message ?? "Failed to load steps");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [memberId, issueId]);

  return { steps, loading, error };
}
