import { useEffect, useState } from "react";
import { IssueContextSummaryDto } from "../types/issueContext";
import { getIssueContextSummary } from "../api/issueContextApi";

export function useIssueContextSummary(caseId: string, memberId: string) {
    const [data, setData] = useState<IssueContextSummaryDto | null>(null);
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
                const result = await getIssueContextSummary(caseId);
                if (!cancelled) {
                    setData(result);
                }
            } catch {
                if (!cancelled) {
                    setError("Issue context unavailable");
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
    }, [caseId, memberId]);

    return { data, loading, error };
}
