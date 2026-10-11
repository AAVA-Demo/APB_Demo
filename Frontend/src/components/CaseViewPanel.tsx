import React, { useState } from "react";
import { useDiagnosticPanel } from "../hooks/useDiagnosticPanel";
import { DiagnosticPanelToggleButton } from "./DiagnosticPanelToggleButton";
import { DiagnosticPanelDrawer } from "./DiagnosticPanelDrawer";

interface Props {
  workspaceId: string;
  caseId: string;
}

export const CaseViewPanel: React.FC<Props> = ({ workspaceId, caseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading, error, load } = useDiagnosticPanel(workspaceId, caseId);

  const openPanel = async () => {
    await load();
    setIsOpen(true);
  };

  return (
    <div className="p-3 border rounded">
      <div className="d-flex justify-content-between mb-3">
        <h4>Case {caseId}</h4>
        <DiagnosticPanelToggleButton onClick={openPanel} />
      </div>
      {loading && <div className="alert alert-info p-2">Loading diagnostic panel...</div>}
      {error && <div className="alert alert-danger p-2">{error}</div>}
      <p>Case details content would be displayed here.</p>
      <DiagnosticPanelDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} panelContext={data} />
    </div>
  );
};
