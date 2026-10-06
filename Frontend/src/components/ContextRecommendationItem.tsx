import React, { useState } from 'react';
import { ContextRecommendationItemProps } from '../types/contextRecommendations';

export const ContextRecommendationItem: React.FC<ContextRecommendationItemProps> = ({ title, description, contextSummary }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-title">{title}</h6>
                {expanded ? (
                    <>
                        <p className="card-text mb-1">{description}</p>
                        <small className="text-muted">Context: {contextSummary}</small>
                    </>
                ) : (
                    <p className="card-text text-muted">Tap to expand for details.</p>
                )}
                <button
                    type="button"
                    className="btn btn-link p-0 mt-2"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? 'Hide details' : 'Show details'}
                </button>
            </div>
        </div>
    );
};
