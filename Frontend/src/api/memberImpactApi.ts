import { apiGet } from "./apiClient";
import {
  MemberImpactIssuesResponse,
  MemberImpactRecommendationsResponse,
} from "../types/memberImpact";

export function getPrioritizedIssues(memberId: string) {
  return apiGet<MemberImpactIssuesResponse>(
    `api/diagnostics/members/${encodeURIComponent(memberId)}/issues`
  );
}

export function getPrioritizedRecommendations(memberId: string) {
  return apiGet<MemberImpactRecommendationsResponse>(
    `api/diagnostics/members/${encodeURIComponent(
      memberId
    )}/recommendations`
  );
}
