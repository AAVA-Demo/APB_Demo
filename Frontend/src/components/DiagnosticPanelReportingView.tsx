import React, { useState } from 'react';
import { useAiAssistedResolutionMetrics } from '../hooks/useAiAssistedResolutionMetrics';
import { MetricsFilterBarProps, AiAssistedMetricsSummaryCardProps } from '../types/aiAssistedMetrics';
import { MetricsFilterBar } from './MetricsFilterBar';
import { AiAssistedMetricsSummaryCard } from './AiAssistedMetricsSummaryCard';

export const DiagnosticPanelReportingView: React.FC = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const { metrics, loading, error } = useAiAssistedResolutionMetrics(fromDate, toDate);

    const handleChange: MetricsFilterBarProps['onChange'] = (from, to) => {
        setFromDate(from);
        setToDate(to);
    };

    return (
        <div className="p-3">
            <MetricsFilterBar fromDate={fromDate} toDate={toDate} onChange={handleChange} />
            {loading && <div className="mt-3">Loading metrics...</div>}
            {error && <div className="mt-3 text-danger">{error}</div>}
            {metrics && (
                <div className="mt-3">
                    <AiAssistedMetricsSummaryCard
                        totalCases={metrics.totalCases}
                        averageResolutionTimeMinutes={metrics.averageResolutionTimeMinutes}
                        averageStepsPerCase={metrics.averageStepsPerCase}
                    />
                </div>
            )}
            {!loading && !error && !metrics && fromDate && toDate && (
                <div className="mt-3 text-muted">No AI-assisted cases found for the selected period.</div>
            )}
        </div>
    );
};
