import React from "react";
import { useInsightStream } from "../hooks/useInsightStream";
import { InsightList } from "./InsightList";
import { RecommendationList } from "./RecommendationList";

interface Props {
    interactionId: string;
}

export const DiagnosticPanelRealtimeView: React.FC<Props> = ({ interactionId }) => {
    const { data, loading, error, updated } = useInsightStream(interactionId);

    if (loading && !data) {
        return <div className="p-3">Connecting to real-time updates...</div>;
    }

    if (error) {
        return <div className="alert alert-danger p-2">{error}</div>;
    }

    if (!data) {
        return <div className="text-muted p-2">No real-time data available.</div>;
    }

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Real-time Insights</h5>
                {updated && <span className="badge bg-success">Updated</span>}
            </div>
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <InsightList insights={data.insights} />
                </div>
                <div className="col-12 col-md-6">
                    <RecommendationList recommendations={data.recommendations} />
                </div>
            </div>
        </div>
    );
};
