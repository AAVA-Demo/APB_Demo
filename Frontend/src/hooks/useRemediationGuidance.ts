import { useEffect, useState } from "react";
import { RemediationGuidanceDto } from "../types/remediation";
import { getIssueRemediationSteps } from "../api/remediationGuidanceApi";

export function useRemediationGuidance(caseId: string, issueId: string) {
    const [data, setData] = useState<RemediationGuidanceDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        if (!issueId) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const result = await getIssueRemediationSteps(caseId, issueId);
            setData(result);
        } catch (e: any) {
            if (e.response?.status === 404) {
                setError("Issue not found.");
            } else {
                setError("Unable to load remediation steps.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (caseId && issueId) {
            load();
        }
    }, [caseId, issueId]);

    return { data, loading, error, refresh: load };
}
