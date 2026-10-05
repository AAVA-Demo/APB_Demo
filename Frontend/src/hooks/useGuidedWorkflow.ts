import { useEffect, useState } from 'react';
import { Workflow, WorkflowStep } from '../types/workflow';
import { workflowApi } from '../api/workflowApi';

export function useGuidedWorkflow(issueId: string) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await workflowApi.getWorkflow(issueId);
        if (!cancelled) {
          setWorkflow(result);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load workflow');
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

  const completeStep = async (step: WorkflowStep) => {
    if (!workflow) return;
    try {
      setLoading(true);
      const updated = await workflowApi.completeStep(issueId, step.id, { completedAt: new Date().toISOString() });
      setWorkflow(updated);
    } catch (e) {
      setError('Failed to complete step');
    } finally {
      setLoading(false);
    }
  };

  return { workflow, loading, error, completeStep };
}
