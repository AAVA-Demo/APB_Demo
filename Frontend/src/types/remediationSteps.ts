export interface RemediationStepDto {
  stepNumber: number;
  title: string;
  description: string;
}

export interface CaseRemediationStepsDto {
  caseId: string;
  issuePatternId: string;
  steps: RemediationStepDto[];
}
