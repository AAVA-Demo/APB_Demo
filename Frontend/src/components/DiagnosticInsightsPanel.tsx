import React from 'react';
import { useDiagnosticInsights } from '../hooks/useDiagnosticInsights';
import { InsightMetricCard } from './InsightMetricCard';

interface Props {
  caseId: string;
}

export const DiagnosticInsightsPanel: React.FC<Props> = ({ caseId }) => {
  const { data, loading, error } = useDiagnosticInsights(caseId);

  if (loading) {
    return <div className="p-3 text-center">Loading diagnostic insights...</div>;
  }

  if (error) {
    return <div className="alert alert-warning p-2">{error}</div>;
  }

  if (!data || data.insights.length === 0) {
    return <div className="p-3 text-muted">No diagnostic insights available.</div>;
  }

  return (
    <div className="p-3 border rounded">
      <div className="d-flex justify-content-between mb-2">
        <h5 className="mb-0">Diagnostic Insights</h5>
        <small className="text-muted">Generated at {new Date(data.generatedAt).toLocaleString()}</small>
      </div>
      <div className="row">
        {data.insights.map((insight) => (
          <div key={insight.key} className="col-md-6 mb-2">
            <InsightMetricCard insight={insight} />
          </div>
        ))}
      </div>
    </div>
  );
};
