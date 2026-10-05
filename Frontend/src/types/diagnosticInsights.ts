export interface DiagnosticInsightDto {
  insightId: string;
  summary: string;
  severity: string;
}

export interface DiagnosticInsightsResponse {
  memberId: string;
  insights: DiagnosticInsightDto[];
  lastUpdated: string;
}

export interface DiagnosticInsightViewModel {
  insightId: string;
  summary: string;
  severity: string;
  lastUpdatedLabel: string;
}
