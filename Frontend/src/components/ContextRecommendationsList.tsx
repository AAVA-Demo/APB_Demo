import React from 'react';
import { ContextRecommendationsListProps } from '../types/contextRecommendations';
import { useContextAwareRecommendations } from '../hooks/useContextAwareRecommendations';
import { ContextRecommendationItem } from './ContextRecommendationItem';

export const ContextRecommendationsList: React.FC<ContextRecommendationsListProps> = ({ memberIssueId }) => {
    const { data, loading, error } = useContextAwareRecommendations(memberIssueId);

    if (loading) {
        return <div className="p-3 border rounded bg-light">Loading recommendations...</div>;
    }

    if (error) {
        return <div className="p-3 border rounded bg-light text-danger">{error}</div>;
    }

    if (!data || !data.recommendations.length) {
        return <div className="p-3 border rounded bg-light">No context-aware recommendations at this time.</div>;
    }

    return (
        <section className="p-3 border rounded bg-white mb-3">
            <h5 className="mb-2">Recommendations</h5>
            <div className="d-flex flex-column gap-2">
                {data.recommendations.map(rec => (
                    <ContextRecommendationItem
                        key={rec.recommendationId}
                        recommendationId={rec.recommendationId}
                        title={rec.title}
                        description={rec.description}
                        contextSummary={rec.contextSummary}
                    />
                ))}
            </div>
        </section>
    );
};
