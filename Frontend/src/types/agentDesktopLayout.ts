export interface DesktopRegionConfiguration {
  regionId: string;
  name: string;
  supportsAiPanel: boolean;
}

export interface AgentDesktopLayoutConfiguration {
  regions: DesktopRegionConfiguration[];
}

export interface AiDiagnosticPanelConfiguration {
  isEnabled: boolean;
  defaultRegionId: string;
  panelTitle: string;
}
