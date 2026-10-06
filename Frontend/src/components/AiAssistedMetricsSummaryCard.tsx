import React from 'react';
import { AiAssistedMetricsSummaryCardProps } from '../types/aiAssistedMetrics';

export const AiAssistedMetricsSummaryCard: React.FC<AiAssistedMetricsSummaryCardProps> = ({ totalCases, averageResolutionTimeMinutes, averageStepsPerCase }) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">AI-Assisted Resolution Metrics</h5>
                <p className="mb-1">Total cases: {totalCases}</p>
                <p className="mb-1">Average resolution time (minutes): {averageResolutionTimeMinutes.toFixed(2)}</p>
                <p className="mb-0">Average steps per case: {averageStepsPerCase.toFixed(2)}</p>
            </div>
        </div>
    );
};
