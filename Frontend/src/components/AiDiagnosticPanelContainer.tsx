import React from "react";
import { AiDiagnosticPanelConfiguration } from "../types/agentDesktopLayout";
import { AiDiagnosticPanel } from "./AiDiagnosticPanel";

export interface AiDiagnosticPanelContainerProps {
  regionId: string;
  aiPanelConfig: AiDiagnosticPanelConfiguration;
  interactionId: string;
}

export const AiDiagnosticPanelContainer: React.FC<AiDiagnosticPanelContainerProps> = ({ aiPanelConfig, interactionId }) => {
  if (!aiPanelConfig.isEnabled) {
    return null;
  }

  return (
    <div className="border-start p-3" style={{ width: "320px" }}>
      <h5 className="mb-3">{aiPanelConfig.panelTitle}</h5>
      <AiDiagnosticPanel interactionId={interactionId} />
    </div>
  );
};
