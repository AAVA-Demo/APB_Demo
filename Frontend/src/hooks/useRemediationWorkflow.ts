import { useEffect, useState } from "react";
import { RemediationWorkflowViewModel, RemediationWorkflowStepViewModel } from "../types/remediationWorkflow";
import { getRemediationWorkflowForCase, startRemediationWorkflowForIssue, updateRemediationStepStatus } from "../api/remediationWorkflowApi";

export function useRemediationWorkflow(caseId: string, issueId: string) {
    const [workflow, setWorkflow] = useState<RemediationWorkflowViewModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getRemediationWorkflowForCase(caseId)
            .then(mapWorkflow)
            .then(setWorkflow)
            .catch(() => {
                startRemediationWorkflowForIssue(caseId, issueId)
                    .then(() => getRemediationWorkflowForCase(caseId))
                    .then(mapWorkflow)
                    .then(setWorkflow)
                    .catch(e => setError(typeof e.message === "string" ? e.message : "Failed to start remediation workflow."))
                    .finally(() => setIsLoading(false));
            });
    }, [caseId, issueId]);

    const onUpdateStepStatus = (stepInstanceId: string, status: string) => {
        updateRemediationStepStatus(caseId, stepInstanceId, status)
            .then(dto => {
                setWorkflow(prev => {
                    if (!prev) return prev;
                    const steps = prev.steps.map(s =>
                        s.stepInstanceId === dto.stepInstanceId ? { ...s, status: dto.status } : s
                    );
                    return { ...prev, steps };
                });
            })
            .catch(e => setError(typeof e.message === "string" ? e.message : "Failed to update step status."));
    };

    function mapWorkflow(dto: any): RemediationWorkflowViewModel {
        return {
            caseId: dto.caseId,
            issueId: dto.issueId,
            steps: dto.steps.map((s: any): RemediationWorkflowStepViewModel => ({
                stepInstanceId: s.stepInstanceId,
                definitionStepId: s.definitionStepId,
                order: s.order,
                title: s.title,
                description: s.description,
                isRequired: s.isRequired,
                status: s.status
            })),
            overallStatus: dto.overallStatus
        };
    }

    return { workflow, isLoading, error, onUpdateStepStatus };
}
