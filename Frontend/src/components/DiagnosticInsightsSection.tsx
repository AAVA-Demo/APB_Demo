import React from 'react';
import { useDiagnosticInsights } from '../hooks/useDiagnosticInsights';
import { DiagnosticInsightsSectionProps } from '../types/diagnosticInsights';
import { ContributingFactorList } from './ContributingFactorList';

export const DiagnosticInsightsSection: React.FC<DiagnosticInsightsSectionProps> = ({ memberIssueId }) => {
    const { insights, loading, error } = useDiagnosticInsights(memberIssueId);

    if (loading) {
        return <div className="p-3 border rounded bg-light">Loading diagnostic insights...</div>;
    }

    if (error) {
        return <div className="p-3 border rounded bg-light text-danger">{error}</div>;
    }

    if (!insights) {
        return <div className="p-3 border rounded bg-light">Diagnostic insights are not available for this issue.</div>;
    }

    return (
        <section className="p-3 border rounded bg-white mb-3">
            <h5 className="mb-2">Diagnostic Insights</h5>
            <p className="mb-2"><strong>Root cause:</strong> {insights.rootCauseSummary}</p>
            <ContributingFactorList contributingFactors={insights.contributingFactors} />
            <small className="text-muted">Generated at: {new Date(insights.generatedAt).toLocaleString()}</small>
        </section>
    );
};
