import React, { useState } from "react";
import { RealTimeInsightDto } from "../types/realTimeInsights";

interface Props {
    insight: RealTimeInsightDto;
}

export const RealTimeInsightItem: React.FC<Props> = ({ insight }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div className="border rounded p-2 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center">
                <div className="fw-semibold">{insight.summary}</div>
                <div className="text-muted small ms-2">{new Date(insight.generatedAt).toLocaleString()}</div>
            </div>
            {expanded && <div className="mt-1 small">{insight.details}</div>}
            <button
                type="button"
                className="btn btn-link btn-sm align-self-start p-0 mt-1"
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? "Hide details" : "Show details"}
            </button>
        </div>
    );
};
