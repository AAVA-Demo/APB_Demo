export interface DiagnosticInsight {
  key: string;
  label: string;
  value: string;
  unit?: string;
}

export interface DiagnosticInsights {
  caseId: string;
  insights: DiagnosticInsight[];
  generatedAt: string;
}
