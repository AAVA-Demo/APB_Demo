import React from "react";

interface Props {
    lastRefreshUtc: string;
    refreshInProgress: boolean;
}

export const InsightsRefreshStatusBar: React.FC<Props> = ({ lastRefreshUtc, refreshInProgress }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Last refreshed: {lastRefreshUtc || "Unknown"}</span>
            {refreshInProgress && <span className="text-primary">Refresh in progress...</span>}
        </div>
    );
};
