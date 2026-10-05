export interface IssueEventDto {
    timestamp: string;
    description: string;
}

export interface KeyIndicatorDto {
    name: string;
    value: string;
}

export interface IssueContextSummaryResponse {
    caseId: string;
    memberId: string;
    summaryText: string;
    recentEvents: IssueEventDto[];
    keyIndicators: KeyIndicatorDto[];
}
