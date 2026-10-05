export interface WorkflowStep {
  id: string;
  order: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface Workflow {
  id: string;
  issueId: string;
  name: string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  totalSteps: number;
}

export interface CompleteStepRequest {
  completedAt?: string;
}
