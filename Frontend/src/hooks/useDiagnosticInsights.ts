import { useEffect, useState } from "react";
import { getDiagnosticInsights } from "../api/diagnosticInsightsApi";
import { DiagnosticInsightListDto } from "../types/diagnosticInsights";

export const useDiagnosticInsights = (caseId: string) => {
    const [data, setData] = useState<DiagnosticInsightListDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        setError(null);
        getDiagnosticInsights(caseId)
            .then(setData)
            .catch(err => {
                setError(err.message ?? "Failed to load diagnostic insights.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (caseId) {
            load();
        }
    }, [caseId]);

    return { data, loading, error, reload: load };
};
