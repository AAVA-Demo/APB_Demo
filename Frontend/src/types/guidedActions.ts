export interface GuidedActionDto {
  actionId: string;
  actionName: string;
  additionalContext?: string;
}

export interface GuidedActionExecutionLog {
  logId: string;
  interactionId: string;
  agentId: string;
  actionId: string;
  actionName: string;
  executedAt: string;
}

export interface LogGuidedActionExecutionRequestDto {
  interactionId: string;
  agentId: string;
  actionId: string;
  actionName: string;
  executedAt: string;
  additionalContext: string;
}

export interface LogGuidedActionExecutionResponseDto {
  logId: string;
  interactionId: string;
  actionId: string;
  status: string;
}
