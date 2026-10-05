import { useEffect, useState } from "react";
import {
  MemberImpactIssueViewModel,
  MemberImpactRecommendationViewModel,
  MemberImpactIssuesResponse,
} from "../types/memberImpact";
import { getPrioritizedIssues } from "../api/memberImpactApi";

export function useMemberImpact(memberId: string) {
  const [issues, setIssues] = useState<MemberImpactIssueViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getPrioritizedIssues(memberId)
      .then((response: MemberImpactIssuesResponse) => {
        if (!isMounted) return;
        const mappedIssues: MemberImpactIssueViewModel[] = response.issues.map(
          (i) => ({
            issueId: i.issueId,
            title: i.title,
            impactScore: i.impactScore,
            impactLevel: i.impactLevel,
            impactLabel: `${i.impactLevel} Impact`,
          })
        );
        setIssues(mappedIssues);
        setLoading(false);
      })
      .catch((e) => {
        if (!isMounted) return;
        setError(e.message ?? "Failed to load issues");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [memberId]);

  return { issues, loading, error };
}
