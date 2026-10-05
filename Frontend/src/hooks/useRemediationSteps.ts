import { useEffect, useState } from "react";
import { remediationStepsApi } from "../api/remediationStepsApi";
import type { RemediationStep } from "../types/remediationSteps";
import type { ApiError } from "../api/apiClient";

export function useRemediationSteps(issueId: string) {
    const [steps, setSteps] = useState<RemediationStep[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!issueId) return;
        setLoading(true);
        setError(null);
        remediationStepsApi
            .getRemediationSteps(issueId)
            .then((data) =>
                setSteps([...data].sort((a, b) => a.stepOrder - b.stepOrder))
            )
            .catch((err: ApiError) => setError(err.message))
            .finally(() => setLoading(false));
    }, [issueId]);

    return { steps, loading, error };
}
