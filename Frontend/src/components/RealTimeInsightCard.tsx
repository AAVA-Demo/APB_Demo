import React from "react";
import { RealTimeInsightItemDto } from "../types/realtimeInsight";

interface Props {
    item: RealTimeInsightItemDto;
}

export const RealTimeInsightCard: React.FC<Props> = ({ item }) => {
    return (
        <div className="card h-100">
            <div className="card-body">
                <h6 className="card-title d-flex justify-content_between">
                    <span>{item.title}</span>
                    <span className="badge bg-info">{item.severity}</span>
                </h6>
                <p className="card-text small">{item.description}</p>
                <p className="card-text text-muted small mb-0">
                    Updated: {new Date(item.lastUpdatedUtc).toLocaleString()}
                </p>
            </div>
        </div>
    );
};
