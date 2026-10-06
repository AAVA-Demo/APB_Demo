import React from "react";
import { RealTimeInsightViewModel } from "../types/realTimeInsights";
import { RealTimeInsightItem } from "./RealTimeInsightItem";

interface Props {
    insights: RealTimeInsightViewModel[];
    isLoading: boolean;
}

export const RealTimeInsightsList: React.FC<Props> = ({ insights, isLoading }) => {
    if (isLoading) {
        return <div className="text-muted">Loading real-time insights...</div>;
    }

    if (insights.length === 0) {
        return <div className="text-muted">No real-time insights available.</div>;
    }

    return (
        <div className="list-group mb-3">
            {insights.map(i => (
                <RealTimeInsightItem key={i.insightId} insight={i} />
            ))}
        </div>
    );
};
