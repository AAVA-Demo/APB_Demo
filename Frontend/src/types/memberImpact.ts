export interface MemberImpactRecommendationDto {
  recommendationId: string;
  description: string;
  impactScore: number;
  impactLevel: string;
}

export interface MemberImpactIssueDto {
  issueId: string;
  title: string;
  impactScore: number;
  impactLevel: string;
  recommendations: MemberImpactRecommendationDto[];
}

export interface MemberImpactIssuesResponse {
  memberId: string;
  issues: MemberImpactIssueDto[];
}

export interface MemberImpactRecommendationsResponse {
  memberId: string;
  recommendations: MemberImpactRecommendationDto[];
}

export interface MemberImpactIssueViewModel {
  issueId: string;
  title: string;
  impactScore: number;
  impactLevel: string;
  impactLabel: string;
}

export interface MemberImpactRecommendationViewModel {
  recommendationId: string;
  description: string;
  impactScore: number;
  impactLevel: string;
  impactLabel: string;
}
