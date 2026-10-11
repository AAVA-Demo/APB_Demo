export interface InsightDto {
  id: string;
  text: string;
  confidenceLevel: string;
  confidenceScore: number;
  type: string;
}

export interface CaseInsightsDto {
  caseId: string;
  insights: InsightDto[];
  remediations: InsightDto[];
}
