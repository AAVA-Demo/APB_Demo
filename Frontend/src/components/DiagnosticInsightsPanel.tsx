import React from "react";
import { useDiagnosticInsights } from "../hooks/useDiagnosticInsights";
import { DiagnosticInsightList } from "./DiagnosticInsightList";

interface Props {
  memberId: string;
}

export const DiagnosticInsightsPanel: React.FC<Props> = ({ memberId }) => {
  const { insights, loading, error } = useDiagnosticInsights(memberId);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Diagnostic Insights</h5>
        {loading && <div className="spinner-border" role="status" />}
        {error && (
          <div className="alert alert-warning mt-2" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && insights.length === 0 && (
          <p className="text-muted mb-0">No insights available.</p>
        )}
        {!loading && !error && insights.length > 0 && (
          <DiagnosticInsightList insights={insights} />
        )}
      </div>
    </div>
  );
};
