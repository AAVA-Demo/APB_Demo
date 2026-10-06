import React from "react";

interface Props {
    isStreaming: boolean;
}

export const RealTimeInsightsHeader: React.FC<Props> = ({ isStreaming }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="mb-0">Real-Time Insights</h4>
            <span className={"badge " + (isStreaming ? "bg-success" : "bg-secondary")}>
                {isStreaming ? "Streaming" : "Idle"}
            </span>
        </div>
    );
};
