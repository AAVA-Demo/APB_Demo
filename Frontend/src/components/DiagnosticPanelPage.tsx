import React from 'react';
import { useDiagnosticInsights } from '../hooks/useDiagnosticInsights';
import { DiagnosticInsightsList } from './DiagnosticInsightsList';

interface DiagnosticPanelPageProps {
    issueId: string;
}

export const DiagnosticPanelPage: React.FC<DiagnosticPanelPageProps> = ({ issueId }) => {
    const { insights, loading, error } = useDiagnosticInsights(issueId);

    return (
        <div className="container mt-3">
            <h2 className="mb-3">Diagnostic Panel</h2>
            {error && (
                <div className="alert alert-danger" role="alert">
                    Failed to load insights: {error}
                </div>
            )}
            {loading && (
                <div className="text-center my-3">
                    <div className="spinner-border" role="status" />
                </div>
            )}
            {!loading && insights.length === 0 && !error && (
                <div className="alert alert-info" role="alert">
                    No insights available.
                </div>
            )}
            {!loading && insights.length > 0 && (
                <DiagnosticInsightsList insights={insights} />
            )}
        </div>
    );
};
