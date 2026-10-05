import { useEffect, useState } from "react";
import { IssueContextSummaryResponse } from "../types/issueContextSummary";
import { getIssueContextSummary } from "../api/issueContextSummaryApi";

export function useIssueContextSummary(caseId: string, token?: string) {
    const [data, setData] = useState<IssueContextSummaryResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const response = await getIssueContextSummary(caseId, token);
            setData(response);
            setError(null);
        } catch (e: any) {
            setError(e.message || "Failed to load issue context summary");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [caseId, token]);

    return { data, loading, error, refresh: load };
}
