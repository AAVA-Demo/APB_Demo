import React from "react";
import { useHealthStatus } from "../hooks/useHealthStatus";

interface Props {
    systemId?: string;
}

const HealthStatusPanel: React.FC<Props> = () => {
    const { data, loading, error } = useHealthStatus();

    if (loading) {
        return <div className="alert alert-info">Loading health status...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!data) {
        return <div className="alert alert-secondary">No health data available.</div>;
    }

    return (
        <div className="card p-3">
            <h5 className="mb-2">Health Status</h5>
            <p className="mb-1"><strong>Status:</strong> {data.status}</p>
            {data.message && (
                <p className="mb-0"><strong>Message:</strong> {data.message}</p>
            )}
        </div>
    );
};

export default HealthStatusPanel;
