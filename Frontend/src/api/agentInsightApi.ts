import { apiGet } from "./apiClient";
import { AgentInsightResponseDto } from "../types/agentInsight";

export async function getAgentInsights(interactionId: string): Promise<AgentInsightResponseDto> {
    return apiGet<AgentInsightResponseDto>(`/api/agent-insights/${encodeURIComponent(interactionId)}`);
}
