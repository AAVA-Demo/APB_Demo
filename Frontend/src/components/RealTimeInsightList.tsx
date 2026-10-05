import React from "react";
import { RealTimeInsightsResponse } from "../types/realTimeInsights";
import { RealTimeInsightItem } from "./RealTimeInsightItem";

interface Props {
    data: RealTimeInsightsResponse | null;
    loading: boolean;
    error: string | null;
}

export const RealTimeInsightList: React.FC<Props> = ({ data, loading, error }) => {
    if (loading) {
        return <div className="text-muted small">Loading real-time insights...</div>;
    }

    if (error) {
        return <div className="alert alert-secondary py-1 my-0">{error}</div>;
    }

    if (!data || data.insights.length === 0) {
        return <div className="text-muted small">No real-time insights available.</div>;
    }

    return (
        <div className="d-flex flex-column gap-2">
            {data.insights
                .slice()
                .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
                .map(insight => (
                    <RealTimeInsightItem key={insight.id} insight={insight} />
                ))}
        </div>
    );
};
