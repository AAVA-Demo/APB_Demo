export interface IssueSeverityDto {
    issueId: string;
    summary: string;
    severity: string;
}

export interface CaseIssueListDto {
    caseId: string;
    issues: IssueSeverityDto[];
}
