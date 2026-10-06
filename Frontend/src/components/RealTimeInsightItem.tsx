import React from "react";
import { RealTimeInsightViewModel } from "../types/realTimeInsights";

interface Props {
    insight: RealTimeInsightViewModel;
}

export const RealTimeInsightItem: React.FC<Props> = ({ insight }) => {
    return (
        <div className="list-group-item mb-1">
            <div className="d-flex justify-content-between">
                <h5 className="mb-1">{insight.title}</h5>
                <span className="badge bg-info text-dark">{insight.severity}</span>
            </div>
            <p className="mb-1">{insight.description}</p>
            <small className="text-muted">{insight.createdAt}</small>
        </div>
    );
};
