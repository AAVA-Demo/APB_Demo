import { useEffect, useState } from 'react';
import { Workflow, WorkflowStep } from '../types/Workflow';
import { getWorkflow, completeWorkflowStep } from '../api/workflowClient';
import { StepCompletionRequest } from '../types/StepCompletionRequest';

interface UseGuidedWorkflowResult {
    workflow: Workflow | null;
    loading: boolean;
    error: string | null;
    completeStep: (step: WorkflowStep) => void;
}

export function useGuidedWorkflow(issueId: string): UseGuidedWorkflowResult {
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        getWorkflow(issueId)
            .then((data) => {
                if (!isMounted) return;
                setWorkflow(data);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err.message || 'Error loading workflow');
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [issueId]);

    const completeStep = (step: WorkflowStep) => {
        const request: StepCompletionRequest = { stepId: step.id, isCompleted: !step.isCompleted };
        completeWorkflowStep(issueId, step.id, request)
            .then((data) => {
                setWorkflow(data);
            })
            .catch((err) => {
                setError(err.message || 'Error completing step');
            });
    };

    return { workflow, loading, error, completeStep };
}
