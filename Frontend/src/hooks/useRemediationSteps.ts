import { useEffect, useState } from "react";
import { RemediationStepsResponse } from "../types/remediation";
import { getRemediationSteps } from "../api/remediationApi";

export function useRemediationSteps(caseId: string, issueId: string, token?: string) {
    const [data, setData] = useState<RemediationStepsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const response = await getRemediationSteps(caseId, issueId, token);
            setData(response);
            setError(null);
        } catch (e: any) {
            setError(e.message || "Failed to load remediation steps");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [caseId, issueId, token]);

    return { data, loading, error, refresh: load };
}
