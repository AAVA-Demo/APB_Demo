import React from "react";
import { useRealTimeInsights } from "../hooks/useRealTimeInsights";
import { RealTimeInsightList } from "./RealTimeInsightList";

interface Props {
    caseId: string;
}

export const RealTimeInsightPanel: React.FC<Props> = ({ caseId }) => {
    const { data, loading, error, refresh } = useRealTimeInsights(caseId);

    return (
        <div className="card mt-3">
            <div className="card-header d-flex justify-content-between align-items-center">
                <span>Latest Insights</span>
                <button className="btn btn-sm btn-outline-secondary" onClick={refresh}>
                    Refresh
                </button>
            </div>
            <div className="card-body">
                {loading && <div className="text-center"><div className="spinner-border" /></div>}
                {error && <div className="alert alert-danger mb-2">{error}</div>}
                {!loading && !error && data && data.insights.length > 0 && (
                    <RealTimeInsightList items={data.insights} />
                )}
                {!loading && !error && (!data || data.insights.length === 0) && (
                    <p className="text-muted">No latest insights available.</p>
                )}
            </div>
        </div>
    );
};
