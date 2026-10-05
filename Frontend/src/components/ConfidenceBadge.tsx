import React from 'react';

interface ConfidenceBadgeProps {
    confidenceScore: number;
    confidenceBand: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidenceScore, confidenceBand }) => {
    let badgeClass = 'badge bg-secondary';
    if (confidenceBand === 'High') {
        badgeClass = 'badge bg-success';
    } else if (confidenceBand === 'Medium') {
        badgeClass = 'badge bg-warning text-dark';
    } else if (confidenceBand === 'Low') {
        badgeClass = 'badge bg-danger';
    }

    const label = `${confidenceBand || 'Unknown'} (${Math.round(confidenceScore * 100)}%)`;

    return <span className={badgeClass}>{label}</span>;
};
