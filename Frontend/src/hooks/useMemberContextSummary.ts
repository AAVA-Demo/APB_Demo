import { useEffect, useState } from "react";
import { MemberContextSummaryViewModel } from "../types/contextAwareIssues";

export function useMemberContextSummary(caseId: string) {
    const [summary, setSummary] = useState<MemberContextSummaryViewModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        // Placeholder: in real implementation, call backend summary endpoint.
        setSummary({
            caseId,
            memberId: "member-" + caseId,
            summaryText: "Sample context summary for case " + caseId
        });
        setIsLoading(false);
    }, [caseId]);

    return { summary, isLoading, error };
}
