import { useEffect, useState } from "react";
import {
  RemediationStepViewModel,
  RemediationStepListResponse,
} from "../types/remediationStepTracking";
import {
  getTrackedRemediationSteps,
  completeRemediationStep,
} from "../api/remediationStepTrackingApi";

export function useRemediationStepTracker(issueId: string, agentId: string) {
  const [steps, setSteps] = useState<RemediationStepViewModel[]>([]);
  const [nextStepId, setNextStepId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getTrackedRemediationSteps(issueId)
      .then((response: RemediationStepListResponse) => {
        if (!isMounted) return;
        const mapped = response.steps.map((s) => ({
          stepId: s.stepId,
          description: s.description,
          orderIndex: s.orderIndex,
          completed: s.completed,
          isNextStep: response.nextStepId === s.stepId,
        }));
        setSteps(mapped);
        setNextStepId(response.nextStepId);
        setLoading(false);
      })
      .catch((e) => {
        if (!isMounted) return;
        setError(e.message ?? "Failed to load remediation steps");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [issueId]);

  const completeStep = (stepId: string) => {
    setError(null);
    completeRemediationStep(issueId, stepId, { completedBy: agentId })
      .then((response) => {
        setNextStepId(response.nextStepId);
        setSteps((prev) =>
          prev.map((s) => ({
            ...s,
            completed: s.stepId === stepId ? true : s.completed,
            isNextStep:
              response.nextStepId !== null && response.nextStepId === s.stepId,
          }))
        );
      })
      .catch((e) => {
        setError(e.message ?? "Failed to complete step");
      });
  };

  return { steps, nextStepId, loading, error, completeStep };
}
