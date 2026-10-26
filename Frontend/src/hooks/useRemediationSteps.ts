import { useEffect, useState } from "react";
import { getRemediationSteps } from "../api/remediationStepsApi";
import { RemediationStepsDto } from "../types/remediationSteps";

export const useRemediationSteps = (caseId: string, insightId: string) => {
    const [data, setData] = useState<RemediationStepsDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        setError(null);
        getRemediationSteps(caseId, insightId)
            .then(setData)
            .catch(err => {
                setError(err.message ?? "Unable to load remediation steps.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (caseId && insightId) {
            load();
        }
    }, [caseId, insightId]);

    return { data, loading, error, reload: load };
};
