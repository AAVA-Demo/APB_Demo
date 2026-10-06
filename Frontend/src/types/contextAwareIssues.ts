export interface IssueDto {
    issueId: string;
    title: string;
    description: string;
    severity: string;
    recommendationSummary: string;
}

export interface ContextAwareIssueAnalysisResponseDto {
    caseId: string;
    memberId: string;
    contextSnapshotId: string;
    issues: IssueDto[];
}

export interface ContextAwareIssuesResponseDto {
    caseId: string;
    contextSnapshotId: string;
    issues: IssueDto[];
}

export interface ContextAwareIssueViewModel {
    issueId: string;
    title: string;
    description: string;
    severity: string;
    recommendationSummary: string;
}

export interface MemberContextSummaryViewModel {
    caseId: string;
    memberId: string;
    summaryText: string;
}
