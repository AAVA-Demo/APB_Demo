import { useState } from "react";
import { DiagnosticPanelContextDto } from "../types/diagnosticPanel";
import { getDiagnosticPanelContext } from "../api/diagnosticPanelApi";

export function useDiagnosticPanel(workspaceId: string, caseId: string) {
  const [data, setData] = useState<DiagnosticPanelContextDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!workspaceId || !caseId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getDiagnosticPanelContext(workspaceId, caseId);
      setData(result);
    } catch (e: any) {
      const message = e?.response?.data ?? "Failed to load diagnostic panel context.";
      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, load };
}
