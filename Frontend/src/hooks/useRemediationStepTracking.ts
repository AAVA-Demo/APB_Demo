import { useEffect, useState } from "react";
import { RemediationStepStatusListDto, RemediationStepStatusDto } from "../types/remediationStepTracking";
import { getRemediationStepStatus, markRemediationStepCompleted } from "../api/remediationStepTrackingApi";

export function useRemediationStepTracking(caseId: string, issueId: string, completedBy: string) {
    const [data, setData] = useState<RemediationStepStatusListDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [updatingStepId, setUpdatingStepId] = useState<string | null>(null);

    const load = async () => {
        if (!issueId) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const result = await getRemediationStepStatus(caseId, issueId);
            setData(result);
        } catch (e: any) {
            setError("Failed to load step status.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (caseId && issueId) {
            load();
        }
    }, [caseId, issueId]);

    const completeStep = async (stepId: string) => {
        setUpdatingStepId(stepId);
        try {
            const updated = await markRemediationStepCompleted(caseId, issueId, stepId, completedBy);
            setData((prev) => {
                if (!prev) return prev;
                const steps = prev.steps.map((s) => (s.stepId === stepId ? updated : s));
                return { ...prev, steps };
            });
        } catch (e: any) {
            setError("Failed to update step status.");
        } finally {
            setUpdatingStepId(null);
        }
    };

    return { data, loading, error, completeStep, updatingStepId, refresh: load };
}
