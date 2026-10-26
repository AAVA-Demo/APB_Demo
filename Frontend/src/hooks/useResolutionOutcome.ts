import { useState } from "react";
import { recordResolutionOutcome } from "../api/diagnosticOutcomeApi";
import { DiagnosticOutcomeDto, RecordResolutionOutcomeRequest } from "../types/diagnosticOutcome";

export const useResolutionOutcome = (caseId: string, insightId: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DiagnosticOutcomeDto | null>(null);

    const save = (request: RecordResolutionOutcomeRequest) => {
        setLoading(true);
        setError(null);
        recordResolutionOutcome(caseId, insightId, request)
            .then(setResult)
            .catch(err => {
                setError(err.message ?? "Unable to save outcome.");
            })
            .finally(() => setLoading(false));
    };

    return { save, loading, error, result };
};
