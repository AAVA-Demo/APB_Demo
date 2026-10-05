import React from 'react';
import { DiagnosticInsight } from '../types/diagnosticInsights';

interface Props {
  insight: DiagnosticInsight;
}

export const InsightMetricCard: React.FC<Props> = ({ insight }) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body p-2">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted small">{insight.label}</div>
            <div className="fw-bold">
              {insight.value} {insight.unit && <span className="text-muted small">{insight.unit}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
