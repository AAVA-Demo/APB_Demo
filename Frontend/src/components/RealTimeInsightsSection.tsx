import React from "react";
import { useRealTimeInsights } from "../hooks/useRealTimeInsights";
import { InsightFeed } from "./InsightFeed";

interface Props {
  caseId: string;
}

export const RealTimeInsightsSection: React.FC<Props> = ({ caseId }) => {
  const { data, loading, error, refresh } = useRealTimeInsights(caseId);

  return (
    <div className="p-3 border rounded mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Real-time Insights</h5>
        <button className="btn btn-sm btn-outline-primary" onClick={refresh} disabled={loading}>
          Refresh
        </button>
      </div>
      {loading && <div className="text-center py-3 spinner-border" />}
      {error && <div className="alert alert-danger p-2 mb-2">{error}</div>}
      {data && <InsightFeed insights={data.insights} />}
      {!loading && !error && data && data.insights.length === 0 && (
        <div className="text-muted">No insights available.</div>
      )}
    </div>
  );
};
