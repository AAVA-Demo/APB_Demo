import React, { useEffect, useState } from "react";
import { AgentDesktopLayoutConfiguration, AiDiagnosticPanelConfiguration } from "../types/agentDesktopLayout";
import { getAgentDesktopLayout, getAiDiagnosticPanelConfiguration } from "../api/agentDesktopLayoutApi";
import { InteractionWorkspace } from "./InteractionWorkspace";

export interface AgentDesktopShellProps {
  initialInteractionId?: string;
}

export const AgentDesktopShell: React.FC<AgentDesktopShellProps> = ({ initialInteractionId }) => {
  const [layoutConfig, setLayoutConfig] = useState<AgentDesktopLayoutConfiguration | null>(null);
  const [aiPanelConfig, setAiPanelConfig] = useState<AiDiagnosticPanelConfiguration | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [layout, config] = await Promise.all([
          getAgentDesktopLayout(),
          getAiDiagnosticPanelConfiguration(),
        ]);
        setLayoutConfig(layout);
        setAiPanelConfig(config);
      } catch (e: any) {
        setError(e.message || "Failed to load desktop layout.");
      }
    };
    load();
  }, []);

  return (
    <div className="d-flex flex-column h-100">
      {error && <div className="alert alert-warning mb-2">{error}</div>}
      {!layoutConfig || !aiPanelConfig ? (
        <div className="p-3">Loading layout...</div>
      ) : (
        <InteractionWorkspace layoutConfig={layoutConfig} aiPanelConfig={aiPanelConfig} interactionId={initialInteractionId || "interaction-1"} />
      )}
    </div>
  );
};
