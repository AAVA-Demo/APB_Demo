import { useEffect, useState } from "react";
import { remediationClient } from "../api/remediationClient";
import { RemediationStep, UpdateRemediationStepStatusRequest } from "../types/remediation";
import { ApiError } from "../api/apiClient";

export function useRemediationSteps(memberId: string) {
    const [steps, setSteps] = useState<RemediationStep[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memberId) {
            return;
        }
        setLoading(true);
        setError(null);
        remediationClient
            .getRemediationSteps(memberId)
            .then(setSteps)
            .catch((e: ApiError) => setError(e.message))
            .finally(() => setLoading(false));
    }, [memberId]);

    const toggleStepCompleted = (stepId: string) => {
        const current = steps.find((s) => s.id === stepId);
        if (!current) {
            return;
        }

        const request: UpdateRemediationStepStatusRequest = {
            isCompleted: !current.isCompleted,
        };

        const previous = [...steps];
        setSteps((prev) =>
            prev.map((s) =>
                s.id === stepId ? { ...s, isCompleted: request.isCompleted } : s
            )
        );

        remediationClient
            .updateRemediationStep(memberId, stepId, request)
            .then((updated) => {
                setSteps((prev) =>
                    prev.map((s) => (s.id === updated.id ? updated : s))
                );
            })
            .catch((e: ApiError) => {
                setError(e.message);
                setSteps(previous);
            });
    };

    const completionPercentage = steps.length
        ? (steps.filter((s) => s.isCompleted).length / steps.length) * 100
        : 0;

    return { steps, loading, error, toggleStepCompleted, completionPercentage };
}
