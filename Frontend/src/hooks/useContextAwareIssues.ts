import { useEffect, useState } from "react";
import { ContextAwareIssueViewModel, ContextAwareIssuesResponseDto } from "../types/contextAwareIssues";
import { analyzeMemberCaseWithContext, getContextAwareIssuesForCase } from "../api/contextAwareIssuesApi";

export function useContextAwareIssues(caseId: string) {
    const [issues, setIssues] = useState<ContextAwareIssueViewModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const analyze = () => {
        setIsLoading(true);
        setError(null);
        analyzeMemberCaseWithContext(caseId)
            .then(() => getContextAwareIssuesForCase(caseId))
            .then(mapResponse)
            .then(setIssues)
            .catch(e => setError(typeof e.message === "string" ? e.message : "Failed to analyze with context."))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        setIsLoading(true);
        getContextAwareIssuesForCase(caseId)
            .then(mapResponse)
            .then(setIssues)
            .catch(() => setIsLoading(false));
    }, [caseId]);

    function mapResponse(dto: ContextAwareIssuesResponseDto): ContextAwareIssueViewModel[] {
        return dto.issues.map(i => ({
            issueId: i.issueId,
            title: i.title,
            description: i.description,
            severity: i.severity,
            recommendationSummary: i.recommendationSummary
        }));
    }

    return { issues, isLoading, error, analyze };
}
