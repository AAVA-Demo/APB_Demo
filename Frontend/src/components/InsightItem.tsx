import React from "react";
import { InsightDto } from "../types/diagnosticPanel";

interface Props {
    insight: InsightDto;
}

export const InsightItem: React.FC<Props> = ({ insight }) => {
    return (
        <div className="border rounded p-2 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center">
                <div className="fw-semibold">{insight.category}</div>
                <div className="text-muted small ms-2">{new Date(insight.createdAt).toLocaleString()}</div>
            </div>
            <div className="small mt-1">{insight.description}</div>
        </div>
    );
};
