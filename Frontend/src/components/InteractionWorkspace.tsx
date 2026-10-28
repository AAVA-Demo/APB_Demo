import React from "react";
import { AgentDesktopLayoutConfiguration, AiDiagnosticPanelConfiguration } from "../types/agentDesktopLayout";
import { AiDiagnosticPanelContainer } from "./AiDiagnosticPanelContainer";

export interface InteractionWorkspaceProps {
  layoutConfig: AgentDesktopLayoutConfiguration;
  aiPanelConfig: AiDiagnosticPanelConfiguration;
  interactionId: string;
}

export const InteractionWorkspace: React.FC<InteractionWorkspaceProps> = ({ layoutConfig, aiPanelConfig, interactionId }) => {
  const regionId = aiPanelConfig.defaultRegionId;

  return (
    <div className="d-flex flex-row h-100">
      <div className="flex-grow-1 p-3">Main interaction content for {interactionId}</div>
      <AiDiagnosticPanelContainer regionId={regionId} aiPanelConfig={aiPanelConfig} interactionId={interactionId} />
    </div>
  );
};
