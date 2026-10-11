export interface InsightDto {
  id: string;
  text: string;
  timestamp: string;
}

export interface CaseRealTimeInsightsDto {
  caseId: string;
  insights: InsightDto[];
}
