import { apiClient } from "./apiClient";
import { AgentDesktopLayoutConfiguration, AiDiagnosticPanelConfiguration } from "../types/agentDesktopLayout";

export function getAgentDesktopLayout(): Promise<AgentDesktopLayoutConfiguration> {
  return apiClient<AgentDesktopLayoutConfiguration>("/api/agent-desktop/layout");
}

export function getAiDiagnosticPanelConfiguration(): Promise<AiDiagnosticPanelConfiguration> {
  return apiClient<AiDiagnosticPanelConfiguration>("/api/agent-desktop/ai-panel/configuration");
}
