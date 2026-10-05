export interface IssueSummaryDto {
    title: string;
    description: string;
}

export interface InsightDto {
    id: string;
    category: string;
    description: string;
    createdAt: string;
}

export interface PanelContextDto {
    sourceSystem: string;
    openedBy: string;
}

export interface DiagnosticPanelResponse {
    caseId: string;
    memberId: string;
    issueSummary: IssueSummaryDto;
    insights: InsightDto[];
    panelContext: PanelContextDto;
}
