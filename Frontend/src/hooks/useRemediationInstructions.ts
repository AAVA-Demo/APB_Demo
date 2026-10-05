import { useEffect, useState } from "react";
import { getRemediationInstructions } from "../api/remediationInstructionApi";
import { RemediationInstructionResponse } from "../types/remediation";

export function useRemediationInstructions(caseId: string) {
    const [data, setData] = useState<RemediationInstructionResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getRemediationInstructions(caseId)
            .then(setData)
            .catch(err => setError(err.message || "Failed to load remediation instructions"))
            .finally(() => setLoading(false));
    }, [caseId]);

    return { data, loading, error };
}
