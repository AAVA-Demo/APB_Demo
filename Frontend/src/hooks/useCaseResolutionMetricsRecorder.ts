import { useState } from "react";
import { recordCaseResolutionMetrics } from "../api/caseResolutionMetricsApi";
import { CaseResolutionMetricsRequest, CaseResolutionMetricsResponse } from "../types/caseResolutionMetrics";

export function useCaseResolutionMetricsRecorder(caseId: string) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const recordMetrics = async (request: CaseResolutionMetricsRequest): Promise<CaseResolutionMetricsResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await recordCaseResolutionMetrics(caseId, request);
            return response;
        } catch (err: any) {
            setError(err.message || "Failed to record metrics");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { recordMetrics, loading, error };
}
