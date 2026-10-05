import { useEffect, useState } from "react";
import { guidedResolutionApi, GuidedResolutionStepStatusUpdateDto } from "../api/guidedResolutionApi";
import type { GuidedResolutionWorkflow } from "../types/guidedResolution";
import type { ApiError } from "../api/apiClient";

export function useGuidedResolutionWorkflow(issueId: string) {
    const [workflow, setWorkflow] = useState<GuidedResolutionWorkflow | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = () => {
        if (!issueId) return;
        setLoading(true);
        setError(null);
        guidedResolutionApi
            .getWorkflow(issueId)
            .then(setWorkflow)
            .catch((err: ApiError) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, [issueId]);

    const updateStepStatus = (stepId: string, newStatus: string) => {
        if (!issueId) return;
        const payload: GuidedResolutionStepStatusUpdateDto = { stepId, newStatus };
        guidedResolutionApi
            .updateStepStatus(issueId, payload)
            .then(setWorkflow)
            .catch((err: ApiError) => setError(err.message));
    };

    return { workflow, loading, error, updateStepStatus, reload: load };
}
