import { useEffect, useState } from "react";
import { CaseIssueListDto } from "../types/issueSeverity";
import { getCaseIssuesWithSeverity } from "../api/caseIssuesApi";

export function useCaseIssuesWithSeverity(caseId: string) {
    const [data, setData] = useState<CaseIssueListDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getCaseIssuesWithSeverity(caseId);
            setData(result);
        } catch (e: any) {
            if (e.response?.status === 404) {
                setError("Case not found.");
            } else {
                setError("Failed to load issues.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (caseId) {
            load();
        }
    }, [caseId]);

    return { data, loading, error, refresh: load };
}
