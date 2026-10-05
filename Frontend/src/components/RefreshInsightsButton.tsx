import React from "react";

interface RefreshInsightsButtonProps {
    onClick: () => void;
    loading: boolean;
}

export const RefreshInsightsButton: React.FC<RefreshInsightsButtonProps> = ({
    onClick,
    loading,
}) => {
    return (
        <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={onClick}
            disabled={loading}
        >
            {loading ? "Refreshing..." : "Refresh Insights"}
        </button>
    );
};
