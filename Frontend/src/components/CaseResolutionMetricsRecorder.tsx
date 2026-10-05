import React, { useEffect } from "react";
import { useCaseResolutionMetricsRecorder } from "../hooks/useCaseResolutionMetricsRecorder";
import { CaseResolutionMetricsRequest, CaseResolutionMetricsResponse } from "../types/caseResolutionMetrics";

interface CaseResolutionMetricsRecorderProps {
    caseId: string;
    handleTimeSeconds: number;
    stepsFollowed: number;
    aiGuidanceUsed: boolean;
    onMetricsRecorded: (response: CaseResolutionMetricsResponse) => void;
}

export const CaseResolutionMetricsRecorder: React.FC<CaseResolutionMetricsRecorderProps> = ({
    caseId,
    handleTimeSeconds,
    stepsFollowed,
    aiGuidanceUsed,
    onMetricsRecorded,
}) => {
    const { recordMetrics, loading, error } = useCaseResolutionMetricsRecorder(caseId);

    useEffect(() => {
        if (handleTimeSeconds <= 0 || stepsFollowed < 0) {
            return;
        }
        const request: CaseResolutionMetricsRequest = {
            handleTimeSeconds,
            stepsFollowed,
            aiGuidanceUsed,
        };
        recordMetrics(request).then(response => {
            if (response) {
                onMetricsRecorded(response);
            }
        });
    }, [caseId, handleTimeSeconds, stepsFollowed, aiGuidanceUsed, recordMetrics, onMetricsRecorded]);

    return (
        <div className="mt-2">
            {loading && <div className="small text-muted">Recording resolution metrics...</div>}
            {error && <div className="small text-danger">{error}</div>}
        </div>
    );
};
