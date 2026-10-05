import { useEffect, useState } from "react";
import { caseSummaryApi } from "../api/caseSummaryApi";
import type { CaseSummary } from "../types/caseSummary";
import type { ApiError } from "../api/apiClient";

export function useCaseSummary(caseId: string) {
    const [summary, setSummary] = useState<CaseSummary | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!caseId) return;
        setLoading(true);
        setError(null);
        caseSummaryApi
            .getCaseSummary(caseId)
            .then(setSummary)
            .catch((err: ApiError) => setError(err.message))
            .finally(() => setLoading(false));
    }, [caseId]);

    return { summary, loading, error };
}
