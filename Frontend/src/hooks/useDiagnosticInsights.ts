import { useEffect, useState } from "react";
import { DiagnosticInsightResponseDto } from "../types/diagnosticInsight";
import { getDiagnosticInsights } from "../api/diagnosticInsightApi";

export function useDiagnosticInsights(interactionId: string) {
    const [data, setData] = useState<DiagnosticInsightResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!interactionId) {
            return;
        }

        let cancelled = false;

        async function load(retry: boolean) {
            setLoading(true);
            setError(null);
            try {
                const result = await getDiagnosticInsights(interactionId);
                if (!cancelled) {
                    setData(result);
                }
            } catch (e) {
                if (!retry) {
                    await load(true);
                    return;
                }
                if (!cancelled) {
                    setError("Diagnostic insights unavailable");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load(false);

        return () => {
            cancelled = true;
        };
    }, [interactionId]);

    return { data, loading, error };
}
