import React from "react";

interface Props {
    overallStatus: string;
    completedStepCount: number;
    totalStepCount: number;
}

export const WorkflowProgressSummaryBar: React.FC<Props> = ({ overallStatus, completedStepCount, totalStepCount }) => {
    const percentage = totalStepCount === 0 ? 0 : Math.round((completedStepCount / totalStepCount) * 100);

    return (
        <div className="mb-3">
            <div className="d-flex justify-content-between mb-1">
                <span>Workflow status: {overallStatus || "Unknown"}</span>
                <span>{completedStepCount} of {totalStepCount} steps completed</span>
            </div>
            <div className="progress">
                <div className="progress-bar" style={{ width: `${percentage}%` }}>
                    {percentage}%
                </div>
            </div>
        </div>
    );
};
