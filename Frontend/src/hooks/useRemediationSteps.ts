import { useEffect, useState } from "react";
import { RemediationStepsResponseDto } from "../types/remediation";
import { getRemediationSteps } from "../api/remediationApi";

export function useRemediationSteps(caseId: string) {
    const [data, setData] = useState<RemediationStepsResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!caseId) {
            return;
        }

        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const result = await getRemediationSteps(caseId);
                if (!cancelled) {
                    setData(result);
                }
            } catch {
                if (!cancelled) {
                    setError("Remediation steps unavailable");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [caseId]);

    return { data, loading, error };
}
