export interface RemediationStepDto {
  stepId: string;
  description: string;
  orderIndex: number;
  completed: boolean;
}

export interface RemediationStepResponse {
  memberId: string;
  issueId: string;
  steps: RemediationStepDto[];
}

export interface RemediationStepViewModel {
  stepId: string;
  description: string;
  orderIndex: number;
  completed: boolean;
}
