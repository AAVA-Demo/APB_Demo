import React from "react";
import { InsightDto } from "../types/diagnosticPanel";
import { InsightItem } from "./InsightItem";

interface Props {
    insights: InsightDto[];
}

export const InsightList: React.FC<Props> = ({ insights }) => {
    if (!insights || insights.length === 0) {
        return <div className="text-muted small">No diagnostic insights available.</div>;
    }

    return (
        <div className="d-flex flex-column gap-2">
            {insights.map(insight => (
                <InsightItem key={insight.id} insight={insight} />
            ))}
        </div>
    );
};
