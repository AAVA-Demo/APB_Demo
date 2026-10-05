import { useEffect, useState } from "react";
import { DiagnosticPanelResponse } from "../types/diagnosticPanel";
import { getDiagnosticPanel } from "../api/diagnosticPanelApi";

export function useDiagnosticPanelData(caseId: string, memberId?: string, token?: string) {
    const [data, setData] = useState<DiagnosticPanelResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const response = await getDiagnosticPanel(caseId, memberId, token);
            setData(response);
            setError(null);
        } catch (e: any) {
            setError(e.message || "Failed to load diagnostic panel");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [caseId, memberId, token]);

    return { data, loading, error, refresh: load };
}
