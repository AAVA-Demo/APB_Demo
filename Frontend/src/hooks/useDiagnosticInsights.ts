import { useEffect, useState } from "react";
import { DiagnosticInsightDto } from "../types/diagnostic";
import { getRealTimeDiagnostics } from "../api/diagnosticsApi";

export function useDiagnosticInsights(caseId: string) {
    const [data, setData] = useState<DiagnosticInsightDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getRealTimeDiagnostics(caseId);
            setData(result);
        } catch (e: any) {
            if (e.response?.status === 404) {
                setError("Case not found.");
            } else if (e.response?.status === 503) {
                setError("Diagnostics temporarily unavailable.");
            } else {
                setError("Failed to load diagnostics.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (caseId) {
            load();
        }
    }, [caseId]);

    return { data, loading, error, refresh: load };
}
