import React from "react";

interface ProgressBarProps {
    completionPercentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completionPercentage }) => {
    const value = Math.round(completionPercentage);

    return (
        <div className="mb-2">
            <div className="progress" style={{ height: "0.75rem" }}>
                <div
                    className="progress-bar bg-success"
                    style={{ width: `${value}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
            <div className="small text-muted mt-1">{value}% completed</div>
        </div>
    );
};
