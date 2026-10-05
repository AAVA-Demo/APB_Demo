import React from "react";
import { InsightDto } from "../types/insightStream";

interface Props {
    insights: InsightDto[];
}

export const InsightList: React.FC<Props> = ({ insights }) => {
    if (!insights.length) {
        return <div className="text-muted">No insights available.</div>;
    }

    return (
        <ul className="list-group">
            {insights.map((insight) => (
                <li key={insight.id} className="list-group-item">
                    <div className="fw-semibold">{insight.title}</div>
                    <div className="text-muted small">{insight.description}</div>
                </li>
            ))}
        </ul>
    );
};
