export interface DiagnosticInsight {
  insightId: string;
  summary: string;
  probableCause: string;
}

export interface RealTimeDiagnosticInsightsResponseDto {
  interactionId: string;
  insights: DiagnosticInsight[];
}
