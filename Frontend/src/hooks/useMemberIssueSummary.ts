import { useEffect, useState } from "react";
import { memberSummaryClient } from "../api/memberSummaryClient";
import { MemberIssueSummary } from "../types/memberIssueSummary";
import { ApiError } from "../api/apiClient";

export function useMemberIssueSummary(memberId: string) {
    const [summary, setSummary] = useState<MemberIssueSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!memberId) {
            return;
        }
        setLoading(true);
        setError(null);
        memberSummaryClient
            .getIssueSummary(memberId)
            .then(setSummary)
            .catch((e: ApiError) => setError(e.message))
            .finally(() => setLoading(false));
    }, [memberId]);

    return { summary, loading, error };
}
