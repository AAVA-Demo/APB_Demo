import React, { useEffect, useState } from "react";
import { getCaseResolutionMetrics } from "../api/caseResolutionMetricsApi";
import { CaseResolutionMetricsResponse } from "../types/caseResolutionMetrics";

interface CaseResolutionMetricsSummaryProps {
    caseId: string;
}

export const CaseResolutionMetricsSummary: React.FC<CaseResolutionMetricsSummaryProps> = ({ caseId }) => {
    const [data, setData] = useState<CaseResolutionMetricsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getCaseResolutionMetrics(caseId)
            .then(setData)
            .catch(err => setError(err.message || "Failed to load metrics"))
            .finally(() => setLoading(false));
    }, [caseId]);

    if (loading) {
        return <div className="p-3">Loading metrics...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!data) {
        return (
            <div className="p-3 border rounded">
                <h6 className="mb-0">Resolution Metrics</h6>
                <p className="mb-0 text-muted">No metrics recorded.</p>
            </div>
        );
    }

    return (
        <div className="p-3 border rounded">
            <h6 className="mb-2">Resolution Metrics</h6>
            <div className="small mb-1">Handle Time: {data.handleTimeSeconds} seconds</div>
            <div className="small mb-1">Steps Followed: {data.stepsFollowed}</div>
            <div className="small mb-0">AI Guidance Used: {data.aiGuidanceUsed ? "Yes" : "No"}</div>
        </div>
    );
};
