import React from 'react';
import { Insight } from '../types/Insight';
import { ConfidenceBadge } from './ConfidenceBadge';

interface DiagnosticInsightsListProps {
    insights: Insight[];
}

export const DiagnosticInsightsList: React.FC<DiagnosticInsightsListProps> = ({ insights }) => {
    const sorted = [...insights].sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="list-group">
            {sorted.map((insight) => (
                <div key={insight.id} className="list-group-item d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="mb-0">{insight.title}</h5>
                        <ConfidenceBadge confidenceBand={insight.confidenceBand} confidenceScore={insight.confidenceScore} />
                    </div>
                    <p className="mb-1 text-muted">{insight.summary || insight.description}</p>
                    <small className="text-secondary">
                        Source: {insight.source || 'Unknown'} | Priority: {insight.priority} | Updated:{' '}
                        {new Date(insight.createdAt || insight.updatedAt).toLocaleString()}
                    </small>
                </div>
            ))}
        </div>
    );
};
