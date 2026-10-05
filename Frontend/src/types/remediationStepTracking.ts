export interface RemediationStepDto {
  stepId: string;
  description: string;
  orderIndex: number;
  completed: boolean;
}

export interface RemediationStepListResponse {
  issueId: string;
  steps: RemediationStepDto[];
  nextStepId: string | null;
}

export interface RemediationStepCompleteRequest {
  completedBy: string;
}

export interface RemediationStepUpdateResponse {
  issueId: string;
  stepId: string;
  completed: boolean;
  nextStepId: string | null;
}

export interface RemediationStepViewModel {
  stepId: string;
  description: string;
  orderIndex: number;
  completed: boolean;
  isNextStep: boolean;
}
