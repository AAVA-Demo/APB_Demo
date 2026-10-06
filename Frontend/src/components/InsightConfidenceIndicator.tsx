import React from "react";

interface Props {
    confidenceScore: number;
    confidenceLevel: string;
    confidenceLabel: string;
    onClick?: () => void;
}

export const InsightConfidenceIndicator: React.FC<Props> = ({ confidenceScore, confidenceLevel, confidenceLabel, onClick }) => {
    const label = confidenceLabel || `Score ${(confidenceScore * 100).toFixed(0)}%`;

    return (
        <button type="button" className="btn btn-sm btn-outline-info" onClick={onClick} title={label}>
            {label}
        </button>
    );
};
