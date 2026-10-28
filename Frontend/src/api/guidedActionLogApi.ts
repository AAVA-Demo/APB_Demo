import { apiClient } from "./apiClient";
import { LogGuidedActionExecutionRequestDto, LogGuidedActionExecutionResponseDto, GuidedActionExecutionLog } from "../types/guidedActions";

export function logGuidedActionExecution(interactionId: string, request: LogGuidedActionExecutionRequestDto): Promise<LogGuidedActionExecutionResponseDto> {
  return apiClient<LogGuidedActionExecutionResponseDto>(`/api/interactions/${interactionId}/guided-actions/log`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function getGuidedActionExecutionLogs(interactionId: string): Promise<GuidedActionExecutionLog[]> {
  return apiClient<GuidedActionExecutionLog[]>(`/api/interactions/${interactionId}/guided-actions/logs`);
}
